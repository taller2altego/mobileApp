
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
import { get } from "../../utils/requests";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions/UpdateUserData";

export default function LoginGoogleButton({ ...props }) {
  const dispatch = useDispatch();
  const [accessToken, setAccessToken] = useState(null);
  const [_, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "1048799441742-pfgd2bp87dl12uj40ug0c1q5ltc38ser.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response && response.type === "success") {
      setAccessToken(response.authentication.accessToken);
      accessToken && fetchUserInfo();
    }
  }, [response, accessToken]);

  const fetchUserInfo = () => {
    get("https://www.googleapis.com/userinfo/v2/me", accessToken).then(
      ({ data }) => {
        dispatch(
          setUserData({
            name: data.name,
            lastname: "",
            email: data.email,
            phone: "",
          })
        );
        props.navigation.navigate("Home");
      }
    );
  };

  return (
    <Pressable onPress={() => promptAsync()} style={{ alignSelf: "center" }}>
      <AntDesign name="google" size={24} color="black" />
    </Pressable>
  );
}
