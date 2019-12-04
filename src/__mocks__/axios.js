import axios from 'axios';

export const BASE_URL = 'http://jsonplaceholder4444.typicode.com';

export default axios.create({
  baseURL: BASE_URL
});
