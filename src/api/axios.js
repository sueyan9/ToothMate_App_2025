import axios from 'axios';
import { API_BASE_URL } from '@env';

export default axios.create({
  baseURL: 'http://172.29.20.208:3000',
});
