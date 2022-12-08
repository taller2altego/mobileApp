import { useState } from "react";
import {
  MapStyles,
  Profilestyles,
  RecoverStyles,
  LandingStyles,
} from "../styles";
import { View, Text, TextInput, Pressable } from "react-native";
import { useFonts } from "expo-font";
import { post, handlerUnauthorizedError } from "../../utils/requests";
import validator from "validator";
import envs from "../../config/env";
export default function RecoverPassword({ navigation }) {
  // redux

  const [email, setEmailText] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  // states
  const { API_URL } = envs;

  const sendMail = (navigation) => {
    if (validator.isEmail(email) === false) {
      setInvalidEmail(true);
    } else {
      setInvalidEmail(false);
      return post(`${API_URL}/recover`, { email: email })
        .then(() => {
          navigation.navigate("AuthToken");
        })
        .catch((error) => handlerUnauthorizedError(navigation, error));
    }
  };

  const comeBack = (navigation) => {
    navigation.navigate("Landing");
  };

  return (
    <View style={Profilestyles.profile_container}>
      <View style={RecoverStyles.info_container}>
        <Text style={RecoverStyles.other_info_text}>
          {
            "Ingresa tu correo electronico, y te enviaremos un enlace para que recuperes el acceso a tu cuenta."
          }
        </Text>
      </View>
      <View style={RecoverStyles.input_text}>
        <TextInput
          style={RecoverStyles.report_container}
          placeholder={"example@hotmail.com"}
          defaultValue={""}
          onChangeText={(newText) => setEmailText(newText)}
          maxLength={100}
        />
      </View>
      {invalidEmail && (
        <View style={RecoverStyles.info_container}>
          <Text style={RecoverStyles.invalid_email}>
            {"Ingrese un correo valido"}
          </Text>
        </View>
      )}
      <View style={LandingStyles.land_container_v2}>
        <View style={LandingStyles.land_buttons_container_v2}>
          <Pressable
            style={({ pressed }) => [
              MapStyles.confirmTripButton,
              { backgroundColor: pressed ? "#333" : "black" },
            ]}
            onPress={() => comeBack(navigation)}
          >
            <Text
              style={{
                fontFamily: "poppins-bold",
                color: "white",
                textAlign: "center",
                lineHeight: 38,
              }}
            >
              Volver atras
            </Text>
          </Pressable>
        </View>
        <View style={LandingStyles.land_buttons_container_v2}>
          <Pressable
            style={({ pressed }) => [
              MapStyles.confirmTripButton,
              { backgroundColor: pressed ? "#333" : "black" },
            ]}
            onPress={() => sendMail(navigation)}
          >
            <Text
              style={{
                fontFamily: "poppins-bold",
                color: "white",
                textAlign: "center",
                lineHeight: 38,
              }}
            >
              Enviar Mail
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
