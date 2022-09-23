import React, { useState } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";
import { useSelector } from "react-redux";

import { LandingStyles } from "../styles";
import RegisterModal from "./register";
import LoginModal from "./login";

export default function Landing({ navigation }) {
  const [modalRegisterVisible, setModalRegisterVisible] = useState(false);
  const [modalLoginVisible, setModalLoginVisible] = useState(false);
  const currentUserData = useSelector((store) => store.currentUserData);

  const handleRegister = () => {
    setModalRegisterVisible(!modalRegisterVisible);
    if (currentUserData.isDriver == "true") {
      navigation.navigate("Driver");
    } else {
      navigation.navigate("Home");
    }
  };

  const toggleRegisterModal = () => {
    setModalRegisterVisible(!modalRegisterVisible);
  };

  const toggleLoginModal = () => {
    setModalLoginVisible(!modalLoginVisible);
  };

  const handleLogin = () => {
    setModalLoginVisible(!modalLoginVisible);
    navigation.navigate("Home");
  };

  return (
    <View style={[LandingStyles.land_container]}>
      <RegisterModal
        visible={modalRegisterVisible}
        handler={handleRegister}
        toggle={toggleRegisterModal}
      >
      </RegisterModal>
      <LoginModal
        visible={modalLoginVisible}
        toggle={toggleLoginModal}
        handler={handleLogin}
      >
      </LoginModal>
      <View style={[LandingStyles.logo]}>
        <Image
          style={LandingStyles.tinyLogo}
          source={{
            uri: "https://reactnative.dev/img/tiny_logo.png",
          }}
        />
      </View>
      <View style={[LandingStyles.land_text_container]}>
        <Text style={[LandingStyles.land_text]}>Bienvenido</Text>
      </View>
      <View style={[LandingStyles.land_text_container]}>
        <Text style={[LandingStyles.land_sub_text]}>
          Por favor, inicia sesion con tu cuenta o registrate para seguir
          utilizando Fiuber
        </Text>
      </View>
      <View style={[LandingStyles.land_buttons_container]}>
        <Pressable
          style={LandingStyles.regButton}
          onPress={() => setModalRegisterVisible(!modalRegisterVisible)}
        >
          <Text style={LandingStyles.textButton}>Sign Up</Text>
        </Pressable>
        <Pressable
          style={LandingStyles.regButton}
          title="Login"
          onPress={() => setModalLoginVisible(!modalLoginVisible)}
        >
          <Text style={LandingStyles.textButton}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}
