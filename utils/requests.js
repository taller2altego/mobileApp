import axios from "axios";

const post = (url, body, extraHeaders) => {
  return axios.post(url, body, { headers: { ...extraHeaders, 'Content-Type': 'application/json' } });
};

const get = (token, extraHeaders) => {
  return axios.get(url, { headers: { ...extraHeaders, 'Authorization': `Bearer ${token}` } });
};

export {
  post,
  get
}