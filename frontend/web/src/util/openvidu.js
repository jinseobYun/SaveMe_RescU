import { OpenVidu } from "openvidu-browser";
import { getToken } from "../api/openviduApi";
import { sendToSTTAPI, convertFloat32ToInt16 } from "../api/speechToTextApi";

export let OV;
export let session;
export let mainStreamManager;
export let publisher;
export let subscribers = [];
let sttInterval = null;
let sttTimeout = null;

export const initOpenVidu = async (sessionId, user) => {
  try {
    OV = new OpenVidu();
    OV.enableProdMode();
    session = OV.initSession();

    session.on("streamCreated", (event) => {

      const subscriber = session.subscribe(event.stream, undefined);
      subscribers.push(subscriber);

      const streamEvent = new CustomEvent("streamCreated", {
        detail: { subscriber },
      });
      window.dispatchEvent(streamEvent);
    });

    session.on("streamDestroyed", (event) => {
      const streamManager = event.stream.streamManager;
      subscribers = subscribers.filter((sub) => sub !== streamManager);
    });

    session.on("exception", (exception) => {
      console.warn(exception);
    });

    session.on("signal", (event) => {
    });

    session.on("signal:report-info", (event) => {
      try {
        const reportData = JSON.parse(event.data); 

        const mappedData = {
        
          patientId: reportData.tagId,
          reporterId: reportData.userId,
          latitude: reportData.location ? reportData.location.latitude : 36.3553193257957,
          longitude: reportData.location ? reportData.location.longitude : 127.29820111515,
        };

        localStorage.setItem("reportData", JSON.stringify(mappedData));

        const reportEvent = new CustomEvent('reportInfoReceived', {
          detail: mappedData,
        });
        window.dispatchEvent(reportEvent);

      } catch (error) {
        console.error("Failed to parse report data:", error);
      }
    });

    const token = await getToken(sessionId);
    await session.connect(token, { clientData: user });

    // 마이크 성능 설정
    const audioSource = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: false,
        suppressLocalAudioPlaybackExperimental: true,
        channelCount: 2,
        sampleRate: 48000,
        sampleSize: 24,
        latency: 0.01,
      },
    });

    const audioContext = new window.AudioContext({ sampleRate: 48000 });
    const sourceNode = audioContext.createMediaStreamSource(audioSource);

    // 오디오 필터 설정
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 1.0;

    const highPassFilter = audioContext.createBiquadFilter();
    highPassFilter.type = "highpass";
    highPassFilter.frequency.setValueAtTime(100, audioContext.currentTime);

    const lowPassFilter = audioContext.createBiquadFilter();
    lowPassFilter.type = "lowpass";
    lowPassFilter.frequency.setValueAtTime(10000, audioContext.currentTime);

    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-20, audioContext.currentTime);
    compressor.knee.setValueAtTime(30, audioContext.currentTime);
    compressor.ratio.setValueAtTime(10, audioContext.currentTime);
    compressor.attack.setValueAtTime(0, audioContext.currentTime);
    compressor.release.setValueAtTime(0.25, audioContext.currentTime);

    sourceNode.connect(gainNode);
    gainNode.connect(highPassFilter);
    highPassFilter.connect(lowPassFilter);
    lowPassFilter.connect(compressor);

    // 내 마이크와 오디오의 분리
    const filteredStream = audioContext.createMediaStreamDestination();
    compressor.connect(filteredStream); // 수정: compressor까지의 오디오 노드를 연결

    // STT용 샘플링 속도를 16000Hz로 변환
    const downsampledAudioContext = new AudioContext({ sampleRate: 16000 });
    const downsampledSourceNode =
      downsampledAudioContext.createMediaStreamSource(filteredStream.stream);

    const analyserNode = downsampledAudioContext.createAnalyser();
    downsampledSourceNode.connect(analyserNode);

    let collectedAudioData = [];
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);

    const processAudioData = () => {
      analyserNode.getFloatTimeDomainData(dataArray);
      collectedAudioData.push(...dataArray);

      const maxVolume = Math.max(...dataArray);
      if (maxVolume < 0.02) {
        if (!sttTimeout) {
          sttTimeout = setTimeout(async () => {
            if (collectedAudioData.length > 0) {
              const audioBytes = convertFloat32ToInt16(collectedAudioData);
              const result = await sendToSTTAPI(audioBytes);
              if (result && result.results && result.results.length > 0) {
                const transcription = result.results
                  .map((res) => res.alternatives[0].transcript)
                  .join("\n");

                const data = { message: transcription, sender: "stt" };
                session.signal({
                  data: JSON.stringify(data),
                  to: [], 
                  type: "my-chat",
                });
              }
              collectedAudioData = [];
              sttTimeout = null;
            }
          }, 1200);
        }
      } else {
        if (sttTimeout) {
          clearTimeout(sttTimeout);
          sttTimeout = null;
        }
      }
    };

    const startSTT = () => {
      if (!sttInterval) {
        sttInterval = setInterval(processAudioData, 120);
      }
    };

    const stopSTT = () => {
      try {
        if (sttTimeout) {
          clearTimeout(sttTimeout);
          sttTimeout = null;
        }
        if (sttInterval) {
          clearInterval(sttInterval);
          sttInterval = null;
        }
      } catch (error) {
        console.error("STT정상종료");
      }
    };

    session.on("sessionDisconnected", () => {
      try {
        stopSTT();
      } catch {
      }
    });

    publisher = await OV.initPublisherAsync(undefined, {
      audioSource: filteredStream.stream,
      videoSource: undefined,
      publishAudio: true,
      publishVideo: true,
      frameRate: 30,
      mirror: false,
    });

    session.publish(publisher);
    mainStreamManager = publisher;

    startSTT();
  } catch (error) {
    console.error("Error initializing OpenVidu:", error);
  }
};

export const leaveSession = () => {
  if (session) {
    try {
      stopSTT();
    } catch {
    }
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

const addChatMessage = (message, alignment) => {
  const event = new CustomEvent("addChatMessage", {
    detail: { message, alignment },
  });
  window.dispatchEvent(event);
};

export const sendChatMessage = (message) => {
  if (session) {
    session
      .signal({
        data: message,
        to: [], 
        type: "chat",
      })
      .then(() => {
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  }
};
