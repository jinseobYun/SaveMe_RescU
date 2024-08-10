import axios from 'axios';

const http = axios.create({
  baseURL: 'https://i11b305.p.ssafy.io/webrtc',
  // baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa('OPENVIDUAPP:YSnUClWgXb8D4NQjSQGvnTX07bOEpy')
  },
});

export default http;