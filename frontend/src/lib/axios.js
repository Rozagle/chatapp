import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
    withCredentials: true, // Enable sending cookies with requests
});

export default instance;