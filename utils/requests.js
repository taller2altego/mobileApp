import axios from "axios";
import * as SecureStore from "expo-secure-store";

const functionError = (navigation) => async () => {
  await SecureStore.deleteItemAsync("token");
  navigation.navigate("Landing");
};

const post = (url, body, extraHeaders, token, errorFunction) => {
  return axios
    .post(url, body, {
      headers: { ...extraHeaders, "Content-Type": "application/json" },
    })
    .catch(async (error) => {
      if (error.response.status == 401) {
        errorFunction();
      }
    });
};

const authPost = (url, token, body, extraHeaders, errorFunction) => {
  return axios.post(url, body, {
    headers: {
      ...extraHeaders,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).catch(async (error) => {
    if (error.response.status == 401) {
      errorFunction();
    }
  });;
};

const get = (url, token, extraHeaders, params, errorFunction) => {
  return axios.get(url, {
    params,
    headers: { ...extraHeaders, Authorization: `Bearer ${token}` },
  }).catch(async (error) => {
    if (error.response.status == 401) {
      errorFunction();
    }
  });;
};

const patch = (url, token, body, extraHeaders, errorFunction) => {
  return axios.patch(url, body, {
    headers: {
      ...extraHeaders,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).catch(async (error) => {
    if (error.response.status == 401) {
      errorFunction();
    }
  });;
};

export { authPost, get, patch, post, functionError };
