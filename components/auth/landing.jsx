import React, { useState } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";

import styles from "../styles";
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
    <View style={[styles.land_container]}>
      <RegisterModal
        visible={modalRegisterVisible}
        toggle={toggleRegisterModal}
      >
      </RegisterModal>
      <LoginModal visible={modalLoginVisible} toggle={toggleLoginModal}>
      </LoginModal>
      <View style={[styles.logo]}>
        <Image
          style={styles.tinyLogo}
          source={{
            uri: "https://reactnative.dev/img/tiny_logo.png",
          }}
        />
      </View>
      <View style={[styles.land_text_container]}>
        <Text style={[styles.land_text]}>Bienvenido</Text>
      </View>
      <View style={[styles.land_text_container]}>
        <Text style={[styles.land_sub_text]}>
          Por favor, inicia sesion con tu cuenta o registrate para seguir
          utilizando Fiuber
        </Text>
      </View>
      <View style={[styles.land_buttons_container]}>
        <Pressable
          style={styles.regButton}
          onPress={() => setModalRegisterVisible(!modalRegisterVisible)}
        >
          <Text style={styles.textButton}>Sign Up</Text>
        </Pressable>
        <Pressable
          style={styles.regButton}
          title="Login"
          onPress={() => setModalLoginVisible(!modalLoginVisible)}
        >
          <Text style={styles.textButton}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}
