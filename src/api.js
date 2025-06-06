import axios from 'axios';

const API = axios.create({
baseURL: 'https://jobcoach-backend-2.onrender.com/',
//baseURL: 'http://localhost:5000/', //local 
});

export default API;
