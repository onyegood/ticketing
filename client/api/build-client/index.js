import axios from 'axios';
import { BASE_URL } from '../base_url';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on server
    return axios.create({
      baseURL: `${BASE_URL}`,
      headers: req.headers
    });
  }else{
    // We must be on the browser
    return axios.create({
      baseURL: '/'
    });
  }
}