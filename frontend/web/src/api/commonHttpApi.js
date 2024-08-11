import axios from 'axios';

const http = axios.create({
  
  // 서버 Openvidu 연결용 주소
  baseURL: 'https://i11b305.p.ssafy.io/webrtc',

  // local Openvidu 연결용 주소
  // baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa('OPENVIDUAPP:YSnUClWgXb8D4NQjSQGvnTX07bOEpy')
  },
});

export default http;