import { OpenVidu } from 'openvidu-browser';
import { getToken } from '../api/openviduApi';

export let OV;
export let session;
export let mainStreamManager;
export let publisher;
export let subscribers = [];

export const initOpenVidu = async (sessionId, user) => {
  try {
    OV = new OpenVidu();
    OV.enableProdMode();
    session = OV.initSession();

    session.on('streamCreated', (event) => {
      const subscriber = session.subscribe(event.stream, undefined);
      subscribers.push(subscriber);
      const streamEvent = new CustomEvent('streamCreated', { detail: { subscriber } });
      window.dispatchEvent(streamEvent);
    });

    session.on('streamDestroyed', (event) => {
      const streamManager = event.stream.streamManager;
      subscribers = subscribers.filter(sub => sub !== streamManager);
    });

    session.on('exception', (exception) => {
      console.warn(exception);
    });

    const token = await getToken(sessionId);
    console.log("Token획득성공!!!")
    await session.connect(token, { clientData: user});

    publisher = await OV.initPublisherAsync(undefined, {
      audioSource: undefined,
      videoSource: undefined,
      publishAudio: true,
      publishVideo: true,
      resolution: '640x480',
      frameRate: 30,
      insertMode: 'APPEND',
      mirror: true,
    });

    session.publish(publisher);
    mainStreamManager = publisher;
  } catch (error) {
    console.error('Error initializing OpenVidu:', error);
  }
};
export const leaveSession = () => {
  if (session) {
    session.disconnect();
  }
  OV = null;
  session = null;
  mainStreamManager = null;
  publisher = null;
  subscribers = [];
};

export const toggleAudio = () => {
  if (publisher) {
    const enabled = !publisher.stream.audioActive;
    publisher.publishAudio(enabled);
    return enabled;
  }
};

export const toggleVideo = () => {
  if (publisher) {
    const enabled = !publisher.stream.videoActive;
    publisher.publishVideo(enabled);
    return enabled;
  }
};
