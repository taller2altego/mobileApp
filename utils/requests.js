import axios from "axios";

const postReq = (url, body, extraHeaders) => {
  return axios.post(url, body, {
    headers: { ...extraHeaders, "Content-Type": "application/json" },
  });
};

const authPostReq = (url, token, body, extraHeaders) => {
  return axios.post(url, body, {
    headers: {
      ...extraHeaders,
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
};

const getReq = (url, token, extraHeaders) => {
  return axios.get(url, {
    headers: { ...extraHeaders, "Authorization": `Bearer ${token}` },
  });
};

const patchReq = (url, token, body, extraHeaders) => {
  return axios.patch(url, body, {
    headers: { ...extraHeaders, "Authorization": `Bearer ${token}` },
  });
};

const deleteReq = (url, token, body, extraHeaders) => {
  return axios.delete(url, body, {
    headers: { ...extraHeaders, "Authorization": `Bearer ${token}` },
  });
};

export { authPostReq, deleteReq, getReq, patchReq, postReq };
