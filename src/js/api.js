import axios from 'axios';

const api = axios.create({
  baseURL: 'http://laptop07.local/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;