import { OpenVidu } from "openvidu-browser";
import { getToken } from "../api/openviduApi";
import { sendToSTTAPI, convertFloat32ToInt16 } from "../api/speechToTextApi";

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

    session.on("streamCreated", (event) => {
      console.log(
        "streamCreated 이벤트 발생, 상대방 session정보: ",
        event.stream.session
      );
      const subscriber = session.subscribe(event.stream, undefined);
      subscribers.push(subscriber);

      // mainStreamManager = subscriber;

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
      console.log("Received signal:", event.data);
    });

    // 1차정보 전달받는 이벤트 등록
    session.on("signal:report-info", (event) => {
      try {
        const reportData = JSON.parse(event.data); // 수신된 데이터를 객체로 변환
        console.log("Received report data:", reportData);

        const mappedData = {
          patientId: reportData.tagId,
          reporterId: reportData.userId,
          latitude: reportData.location.latitude,
          longitude: reportData.location.longitude,
        };

        const reportEvent = new CustomEvent('reportInfoReceived', {
          detail: mappedData,
        });
        window.dispatchEvent(reportEvent);

      } catch (error) {
        console.error("Failed to parse report data:", error);
      }
    });

    const token = await getToken(sessionId);
    console.log("Token 획득 성공!!!");
    console.log("token은 : ", token);
    await session.connect(token, { clientData: user });

    // 마이크 성능설정 최대치
    const audioSource = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: false,
        suppressLocalAudioPlaybackExperimental: true,
        channelCount: 2, // 스테레오
        sampleRate: 48000, // 샘플링 속도 설정
        sampleSize: 24, // 샘플 크기 설정
        latency: 0.01, // 낮은 지연 시간 설정
      },
    });

    const audioContext = new window.AudioContext({ sampleRate: 48000 });
    const sourceNode = audioContext.createMediaStreamSource(audioSource);

    // 게인 노드 (볼륨 조절)
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 1.0;

    // 고역 필터 (저주파 제거)
    const highPassFilter = audioContext.createBiquadFilter();
    highPassFilter.type = "highpass";
    highPassFilter.frequency.setValueAtTime(100, audioContext.currentTime);

    // 저역 필터 (고주파 제거)
    const lowPassFilter = audioContext.createBiquadFilter();
    lowPassFilter.type = "lowpass";
    lowPassFilter.frequency.setValueAtTime(10000, audioContext.currentTime);

    // 다이나믹 컴프레서 (동적 범위 압축)
    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-50, audioContext.currentTime);
    compressor.knee.setValueAtTime(40, audioContext.currentTime);
    compressor.ratio.setValueAtTime(12, audioContext.currentTime);
    compressor.attack.setValueAtTime(0, audioContext.currentTime);
    compressor.release.setValueAtTime(0.25, audioContext.currentTime);

    // 노드를 연결
    sourceNode.connect(gainNode);
    gainNode.connect(highPassFilter);
    highPassFilter.connect(lowPassFilter);
    lowPassFilter.connect(compressor);

    // 내 마이크와 오디오의 분리. (내가 입력한 오디오가 나에게 반환되지 않도록)
    const filteredStream = audioContext.createMediaStreamDestination();
    sourceNode.connect(filteredStream);

    // STT용으로 샘플링 속도를 16000Hz로 변환
    const downsampledAudioContext = new AudioContext({ sampleRate: 16000 });
    const downsampledSourceNode =
      downsampledAudioContext.createMediaStreamSource(filteredStream.stream);

    // 오디오 데이터 수집 및 STT 호출
    const analyserNode = downsampledAudioContext.createAnalyser();
    downsampledSourceNode.connect(analyserNode);

    let collectedAudioData = [];
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);

    const processAudioData = () => {
      analyserNode.getFloatTimeDomainData(dataArray);
      collectedAudioData.push(...dataArray);
    };

    const processInterval = setInterval(processAudioData, 100);

    // 일정 간격으로 STT API 호출
    setInterval(async () => {
      if (collectedAudioData.length > 0) {
        const audioBytes = convertFloat32ToInt16(collectedAudioData);
        const result = await sendToSTTAPI(audioBytes);
        console.log("STT 결과 반환 result: ", result);
        if (result && result.results && result.results.length > 0) {
          const transcription = result.results
            .map((res) => res.alternatives[0].transcript)
            .join("\n");
          session.signal({
            data: transcription,
            to: [], // 모든 사용자에게 전송
            type: "my-chat",
          });
          console.log("transcription은? :", transcription);
        }
        collectedAudioData = [];
      }
    }, 5000); // 5초마다 실행

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

  } catch (error) {
    console.error("Error initializing OpenVidu:", error);
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

const addChatMessage = (message, alignment) => {
  // Chat 컴포넌트에 메시지를 추가하는 함수
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
        to: [], // 빈 배열은 모든 사용자에게 메시지 전송
        type: "chat",
      })
      .then(() => {
        console.log("Message successfully sent");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  }
};
