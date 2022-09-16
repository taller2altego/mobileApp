import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import styles from "../styles";

export default function Landing({ navigation }) {
  return (
    <View style={[styles.land_container]}>
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
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.textButton}>Sign Up</Text>
        </Pressable>
        <Pressable
          style={styles.regButton}
          title="Login"
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.textButton}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}
