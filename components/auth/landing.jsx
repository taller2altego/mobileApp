import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { LandingStyles } from "../styles";
import RegisterModal from "./register";
import LoginModal from "./login";

export default function Landing({ navigation }) {
  const [modalRegisterVisible, setModalRegisterVisible] = useState(false);
  const [modalLoginVisible, setModalLoginVisible] = useState(false);

  const toggleRegisterModal = () => {
    setModalRegisterVisible(!modalRegisterVisible);
  };

  const toggleLoginModal = () => {
    setModalLoginVisible(!modalLoginVisible);
  };

  return (
    <View style={[LandingStyles.land_container]}>
      <RegisterModal
        visible={modalRegisterVisible}
        toggle={toggleRegisterModal}
        navigation={navigation}
      >
      </RegisterModal>
      <LoginModal
        visible={modalLoginVisible}
        toggle={toggleLoginModal}
        navigation={navigation}
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
