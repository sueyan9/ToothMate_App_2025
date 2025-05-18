import axios from 'axios';

export default axios.create({
  baseURL: 'http://192.168.1.166:3000', //'http://172.29.1.220:3000',
});
