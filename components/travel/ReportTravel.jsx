import { useState } from "react";
import {
  MapStyles,
  TravelStyles,
  Profilestyles,
  ReportStyles,
} from "../styles";
import * as SecureStore from "expo-secure-store";
import { View, Text, TextInput, Pressable } from "react-native";
import { useFonts } from "expo-font";
import { authPost, handlerUnauthorizedError } from "../../utils/requests";
import envs from "../../config/env";
import { Ionicons } from "@expo/vector-icons";

export default function ReportTravel({ route, navigation }) {
  // redux

  const [reportText, setReportText] = useState("");

  // states
  const item = route.params;
  const { API_URL, _ } = envs;

  const sendReport = async (navigation) => {
    const id = await SecureStore.getItemAsync("id");
    const token = await SecureStore.getItemAsync("token");
    const data = {
      userId: parseInt(id),
      driverId: item.driver,
      description: reportText,
    };
    return authPost(`${API_URL}/reports`, token, data)
      .then(() =>
        navigation.navigate("TripDetails", { travelId: item.travelId })
      )
      .catch((error) => handlerUnauthorizedError(navigation, error));
  };

  return (
    <View style={[Profilestyles.profile_container]}>
      <Ionicons
        name="arrow-back"
        size={24}
        color="black"
        style={{ top: 35, left: 15, position: "absolute" }}
        onPress={() => navigation.goBack()}
      />
      <Text
        style={{
          fontFamily: "poppins",
          marginTop: "30%",
          fontSize: 20,
          textAlign: "center",
        }}
      >
        {item.driver}
      </Text>
      <View style={ReportStyles.input_text}>
        <TextInput
          style={ReportStyles.report_container}
          placeholder="Escriba su denuncia aqui..."
          onChangeText={(newText) => setReportText(newText)}
          defaultValue={reportText}
          maxLength={500}
        />
      </View>
      <Pressable
        style={({ pressed }) => [
          { backgroundColor: pressed ? "#333" : "black" },
          MapStyles.confirmTripButton,
        ]}
        onPress={() => sendReport(navigation)}
      >
        <Text
          style={{
            fontFamily: "poppins-bold",
            color: "white",
            textAlign: "center",
            lineHeight: 38,
          }}
        >
          Enviar Denuncia
        </Text>
      </Pressable>
    </View>
  );
}
