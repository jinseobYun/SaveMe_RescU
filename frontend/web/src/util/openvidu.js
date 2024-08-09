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

    // 초기 연결 이벤트
    session.on('streamCreated', (event) => {
      console.log('streamCreated 이벤트 발생: ', event);
      console.log('streamCreated 이벤트 발생: ', event.stream);
      console.log('streamCreated 이벤트 발생: ', event.stream.session);
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

    // 채팅관련 기능 (signal을 통해서) 추가
    session.on('signal', (event) => {
      console.log('Received signal:', event.data);
    });

    const token = await getToken(sessionId);
    console.log("Token획득성공!!!")
    console.log("token은 : " ,token)
    await session.connect(token, { clientData: user});

    // audioSource 가 마이크 
    publisher = await OV.initPublisherAsync(undefined, {
      audioSource: undefined,
      videoSource: undefined,
      publishAudio: true,
      publishVideo: true,
      // resolution: '640x480',
      frameRate: 30,
      // insertMode: 'APPEND',
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

// 이거 지우면 오류남.... 
export const sendChatMessage = (message) => {
  if (session) {
    session.signal({
      data: message,
      to: [], // 빈 배열은 모든 사용자에게 메시지 전송
      type: 'chat'
    })
    .then(() => {
      console.log('Message successfully sent');
    })
    .catch(error => {
      console.error('Error sending message:', error);
    });
  }
};