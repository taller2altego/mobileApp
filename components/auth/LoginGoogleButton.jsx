import {
  View,
  ScrollView,
  StatusBar,
  Button,
  Text,
  Pressable,
  ToastAndroid,
} from "react-native";
import { useEffect, useState } from "react";
import * as Google from "expo-auth-session/providers/google";
import { authPost, get } from "../../utils/requests";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions/UpdateUserData";
import * as SecureStore from "expo-secure-store";

import envs from "../../config/env";

export default function LoginGoogleButton({ setErrorMessage, ...props }) {
  const { API_URL, _env } = envs;

  const [accessToken, setAccessToken] = useState(null);
  const [_, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "1048799441742-pfgd2bp87dl12uj40ug0c1q5ltc38ser.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response && response.type === "success") {
      setAccessToken(response.authentication.accessToken);
      accessToken && fetchUserInfo(response.authentication);
    } else if (response) {
      ToastAndroid.showWithGravity(
        response.type,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
    return () => {
      setErrorMessage("");
    }
  }, [response, accessToken]);

  const fetchUserInfo = (authentication) => {
    return authPost(`${API_URL}/login/oauth`, authentication.idToken)
      .then(async (info) => {
        const {
          data: { id, token },
        } = info;
        await SecureStore.setItemAsync("token", token);
        await SecureStore.setItemAsync("id", id.toString());

        const user = await get(`${API_URL}/users/${id.toString()}`, token);
        if (user.data.defaultAddress === null) {
          props.navigation.navigate("DefaultLocationRequest");
          return;
        }
        props.navigation.navigate("Home");
      })
      .catch((e) => {
        const errMessage =
          (e.response && e.response.data && e.response.data.message) ||
          e.message;
        setErrorMessage(errMessage);
      });
  };

  return (
    <Pressable onPress={() => promptAsync()} style={{ alignSelf: "center", minHeight: 50, alignItems: "center", flexDirection: "row", backgroundColor: "#999", height: 10, padding: 10, borderRadius: 5 }}>
      <AntDesign name="google" size={30} color="black" />
      <Text style={{ fontFamily: "poppins", marginLeft: 20, marginTop: 5 }}>Continuar con google</Text>
    </Pressable>
  );
}
