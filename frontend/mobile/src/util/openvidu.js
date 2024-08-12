import { OpenVidu } from "openvidu-browser";
import { getToken } from "@api/reportApi";

export let OV;
export let session;
export let mainStreamManager;
export let publisher;
export let subscribers = [];

export const initOpenVidu = async (sessionId) => {
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

    const token = await getToken(sessionId);
    console.log("Token 획득 성공!!!");
    console.log("token은 : ", token);
    await session.connect(token);

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

    // // 다이나믹 컴프레서 (동적 범위 압축)
    // const compressor = audioContext.createDynamicsCompressor();
    // compressor.threshold.setValueAtTime(-50, audioContext.currentTime);
    // compressor.knee.setValueAtTime(40, audioContext.currentTime);
    // compressor.ratio.setValueAtTime(12, audioContext.currentTime);
    // compressor.attack.setValueAtTime(0, audioContext.currentTime);
    // compressor.release.setValueAtTime(0.25, audioContext.currentTime);

    // // 노드를 연결
    // sourceNode.connect(gainNode);
    // gainNode.connect(highPassFilter);
    // highPassFilter.connect(lowPassFilter);
    // lowPassFilter.connect(compressor);

    // // 내 마이크와 오디오의 분리. (내가 입력한 오디오가 나에게 반환되지 않도록)
    // const filteredStream = audioContext.createMediaStreamDestination();
    // sourceNode.connect(filteredStream);

    // // STT용으로 샘플링 속도를 16000Hz로 변환
    // const downsampledAudioContext = new AudioContext({ sampleRate: 16000 });
    // const downsampledSourceNode =
    //   downsampledAudioContext.createMediaStreamSource(filteredStream.stream);

    // // 오디오 데이터 수집 및 STT 호출
    // const analyserNode = downsampledAudioContext.createAnalyser();
    // downsampledSourceNode.connect(analyserNode);

    // let collectedAudioData = [];
    // const bufferLength = analyserNode.frequencyBinCount;
    // const dataArray = new Float32Array(bufferLength);

    // const processAudioData = () => {
    //   analyserNode.getFloatTimeDomainData(dataArray);
    //   collectedAudioData.push(...dataArray);
    // };

    // const processInterval = setInterval(processAudioData, 100);

    // OpenVidu 퍼블리셔 설정 (분리된 오디오 스트림 사용)
    publisher = await OV.initPublisherAsync(undefined, {
      audioSource: sourceNode.stream,
      videoSource: undefined,
      publishAudio: true,
      publishVideo: true,
      frameRate: 30,
      mirror: true,
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
    session.unpublish(publisher);
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
