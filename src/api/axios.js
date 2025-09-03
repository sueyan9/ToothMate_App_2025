import { API_BASE_URL } from '@env';
import axios from 'axios';

const cleanBaseURL = API_BASE_URL.replace(/\/$/, '');

export default axios.create({
  baseURL: cleanBaseURL,
});
 