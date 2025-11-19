import axios from 'axios';
import config from '../../../core/src/config/config.env';

const baseApi = axios.create({
  baseURL: config.app.baseUrl,
  timeout: 10000,
});

const authApi = axios.create({
  baseURL: config.app.baseUrl,
  timeout: 10000,
  withCredentials: true,  
});

authApi.interceptors.request.use((request) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

export { baseApi, authApi };