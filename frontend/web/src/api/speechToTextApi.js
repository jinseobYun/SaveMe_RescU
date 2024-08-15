export const sendToSTTAPI = async (audioBytes) => {
    try {
      // Int16Array를 Base64로 인코딩
      const uint8Array = new Uint8Array(audioBytes);
      const base64String = btoa(String.fromCharCode(...uint8Array));
  
      const response = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${import.meta.env.VITE_API_SPEECH_TO_TEXT}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            config: {
              encoding: 'LINEAR16',
              sampleRateHertz: 16000, // 오디오의 실제 샘플링 속도와 일치
              languageCode: 'ko-KR',
              model: 'default',
            },
            audio: {
              content: base64String, // Base64로 인코딩된 오디오 데이터
            },
          }),
        }
      );
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("STT API 호출 오류:", error);
      return null;
    }
  };
  
  // Float32Array를 Int16Array로 변환
  export const convertFloat32ToInt16 = (buffer) => {
    let l = buffer.length;
    let buf = new Int16Array(l);
  
    while (l--) {
      buf[l] = Math.max(-1, Math.min(1, buffer[l])) * 0x7FFF;
    }
    return buf.buffer;
  };
  