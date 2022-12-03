import axios from "axios";
import * as SecureStore from "expo-secure-store";

const handlerUnauthorizedError = (navigation, error) => {
  if (error.response.status == 401) {
    SecureStore.deleteItemAsync("token");
    navigation.navigate("Landing");
    return error;
  }
};

const post = (url, body, extraHeaders, token, ) => {
  return axios
    .post(url, body, {
      headers: { ...extraHeaders, "Content-Type": "application/json" },
    })
};

const authPost = (url, token, body, extraHeaders, errorFunction) => {
  return axios.post(url, body, {
    headers: {
      ...extraHeaders,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
};

const get = (url, token, extraHeaders, params, errorFunction) => {
  return axios.get(url, {
    validateStatus: status => {
      return status >= 200 && status < 400;
    },
    params,
    headers: { ...extraHeaders, Authorization: `Bearer ${token}` },
  })
};

const patch = (url, token, body, extraHeaders, errorFunction) => {
  return axios.patch(url, body, {
    headers: {
      ...extraHeaders,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
};

export { authPost, get, patch, post, handlerUnauthorizedError };
