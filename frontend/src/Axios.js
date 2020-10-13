import axios from 'axios';

const token = localStorage.getItem('token');
const Axios = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Authorization': token ? `Bearer ${token}` : ''
  }
});

export default Axios;