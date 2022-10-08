import axios from "axios";

const post = (url, body, extraHeaders) => {
  return axios.post(url, body, {
    headers: { ...extraHeaders, "Content-Type": "application/json"},
  });
};

const authPost = (url, token, body, extraHeaders) => {
  return axios.post(url, body, {
    headers: {
      ...extraHeaders,
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
};

const get = (url, token, extraHeaders) => {
  return axios.get(url, {
    headers: { ...extraHeaders, "Authorization": `Bearer ${token}` },
  });
};

const patch = (url, token, body, extraHeaders) => {
  return axios.patch(url, body, {
    headers: {
      ...extraHeaders, 
      "Content-Type": "application/json", 
      "Authorization": `Bearer ${token}` 
    },
  });
};

export { authPost, get, patch, post };
