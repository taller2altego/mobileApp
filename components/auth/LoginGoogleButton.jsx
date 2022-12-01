
import {
  View,
  ScrollView,
  StatusBar,
  Button,
  Text,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import * as Google from "expo-auth-session/providers/google";
import { authPost } from "../../utils/requests";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions/UpdateUserData";
import * as SecureStore from "expo-secure-store";

import envs from "../../config/env";


export default function LoginGoogleButton({ setErrorMessage, ...props }) {
  const { API_URL, _env } = envs;

  const dispatch = useDispatch();
  const [accessToken, setAccessToken] = useState(null);
  const [_, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "1048799441742-pfgd2bp87dl12uj40ug0c1q5ltc38ser.apps.googleusercontent.com",
  });


  useEffect(() => {
    if (response && response.type === "success") {
      console.log(response);
      setAccessToken(response.authentication.accessToken);
      accessToken && fetchUserInfo(response.authentication);
    }
  }, [response, accessToken]);

  const fetchUserInfo = authentication => {
    return authPost(`${API_URL}/login/oauth`, authentication.idToken)
      .then(async info => {
        const { data: { id, token } } = info;
        await SecureStore.setItemAsync("token", token);
        await SecureStore.setItemAsync("id", id.toString());
        props.navigation.navigate("Home");
      })
      .catch(e => {
        const errMessage = e.response && e.response.data && e.response.data.message || e.message;
        setErrorMessage(errMessage);
      });
  };

  return (
    <Pressable onPress={() => promptAsync()} style={{ alignSelf: "center" }}>
      <AntDesign name="google" size={24} color="black" />
    </Pressable>
  );
}
