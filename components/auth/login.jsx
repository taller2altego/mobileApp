import React, { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { get, post, handlerUnauthorizedError } from "../../utils/requests";
import { LandingStyles, modalStyles } from "../styles";
import { Entypo } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import envs from "../../config/env";
import { useDispatch } from "react-redux";
import { setIsDriver, setUserData } from "../../redux/actions/UpdateUserData";
import LoginGoogleButton from "../auth/LoginGoogleButton";

export default function LoginModal({ ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const { API_URL, _ } = envs;

  const getUserInfo = async (id, token) => {
    return get(`${API_URL}/users/${id}`, token)
      .then(({ data }) => data)
      .catch((error) => handlerUnauthorizedError(navigation, error));
  };

  const onSignIn = () => {
    const body = { email, password };
    return post(`${API_URL}/login`, body, () => {})
      .then(async ({ data: { id, token } }) => {
        await SecureStore.setItemAsync("token", token);
        await SecureStore.setItemAsync("id", id.toString());

        const userInfo = await getUserInfo(id, token);
        const userData = {
          name: userInfo.name,
          lastname: userInfo.lastname,
          phoneNumber: userInfo.phoneNumberm,
          email: userInfo.email,
        };
        dispatch(setUserData(userData));
        dispatch(setIsDriver({ isDriver: userInfo.isDriver }));
        props.toggle();
        setErrorMessage("");
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
    <Modal animationType="slide" transparent={true} visible={props.visible}>
      <View style={[modalStyles.modal_extern_view, { fontFamily: "poppins" }]}>
        <View style={modalStyles.modal_view}>
          <Pressable onPress={props.toggle}>
            <Entypo
              name="cross"
              size={26}
              color="black"
              style={{ left: 5, top: 5 }}
            />
          </Pressable>
          <View style={[modalStyles.flex_modal, { fontFamily: "poppins" }]}>
            <TextInput
              style={modalStyles.modal_input}
              placeholder="Email"
              value={email}
              placeholderTextColor="black"
              onChangeText={(email) => setEmail(email)}
            />
            <TextInput
              style={[modalStyles.modal_input]}
              placeholder="Contraseña"
              placeholderTextColor="black"
              value={password}
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
            <Pressable
              style={({ pressed }) => [
                modalStyles.modal_button,
                { backgroundColor: pressed ? "#333" : "black" },
              ]}
              onPress={() => onSignIn()}
            >
              <Text
                style={[LandingStyles.textButton, { fontFamily: "poppins" }]}
              >
                Login
              </Text>
            </Pressable>
            <LoginGoogleButton
              navigation={props.navigation}
              setErrorMessage={setErrorMessage}
            ></LoginGoogleButton>
            <View style={{ flexDirection: "column", alignItems: "center" }}>
              <Pressable
                onPress={() => props.navigation.navigate("RecoverPassword")}
              >
                <Text
                  style={{
                    fontFamily: "poppins",
                    color: "black",
                    fontSize: 15,
                    marginBottom: 10,
                  }}
                >
                  Forgot Password
                </Text>
              </Pressable>
              <Pressable onPress={() => props.navigation.navigate("AuthToken")}>
                <Text
                  style={{
                    fontFamily: "poppins",
                    fontSize: 15,
                    color: "black",
                  }}
                >
                  Have a Token
                </Text>
              </Pressable>
            </View>

            <Text style={[modalStyles.error_modal, { fontFamily: "poppins" }]}>
              {errorMessage}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
