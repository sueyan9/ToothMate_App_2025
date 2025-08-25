import { API_BASE_URL } from '@env';
import axios from 'axios';

export default axios.create({
  baseURL: API_BASE_URL,
});
 