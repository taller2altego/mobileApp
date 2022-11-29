import axios from "axios";

const post = (url, body, extraHeaders, token, navigation) => {
  return axios.post(url, body, {
    headers: { ...extraHeaders, "Content-Type": "application/json" },
  }).catch(async (error) => {
    if (error.response.status == 400){
      await SecureStore.deleteItemAsync("token");
      navigation.navigate("Landing");
    }
  });
};

const authPost = (url, token, body, extraHeaders, navigation) => {
  return axios.post(url, body, {
    headers: {
      ...extraHeaders,
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
};

const get = (url, token, extraHeaders, params, navigation) => {
  return axios.get(url, {
    params,
    headers: { ...extraHeaders, "Authorization": `Bearer ${token}` },
  });
};

const patch = (url, token, body, extraHeaders, navigation) => {
  return axios.patch(url, body, {
    headers: {
      ...extraHeaders,
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
};

export { authPost, get, patch, post };
