import axios from 'axios';

const API = axios.create({
  baseURL: 'https://jobcoach-backend-2.onrender.com/',
});

export default API;
