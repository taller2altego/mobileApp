import React, { useState, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { get } from "../../utils/requests";
import { Profilestyles } from "../styles";
import HomeTab from "./homeTab";

export default function VisualizationTab({ navigation }) {
  const [name, setName] = useState();
  const [lastname, setLastName] = useState();
  const [email, setEmail] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [numberOfScores, setNumberOfScores] = useState();
  const [averageScore, setAverageScore] = useState();

  useEffect(() => {
    (async () => {
      const id = 2;
      const token = await SecureStore.getItemAsync("token");
      await get(`http://10.0.2.2:5000/users/${id}`, token)
        .then(
          ({ data: { name, lastname, email, phoneNumber, score } }) => {
            setName(name);
            setLastName(lastname);
            setEmail(email);
            setPhoneNumber(phoneNumber);
            setNumberOfScores(score.numberOfScores);
            setAverageScore(score.totalScore);
          }
        );
    })();
  }, []);

  return (
    < View style={Profilestyles.profile_container} >
      <View style={Profilestyles.profile_text_container}>
      </View>
      <View style={Profilestyles.profile_container}>
        <Text style={Profilestyles.profile_visualization}>
        {name} {lastname}
        </Text>
        <Text style={Profilestyles.profile_visualization}>
          {email}
        </Text>
        <Text style={Profilestyles.profile_visualization}>
          {phoneNumber}
        </Text>
        <Text style={Profilestyles.profile_visualization}>
          {numberOfScores} viajes
        </Text>
        <Text style={Profilestyles.profile_visualization}>
          {averageScore} puntaje actual
        </Text>
      </View>
      <View style={Profilestyles.edit_profile}>
        <Pressable
          onPress={() =>
            navigation.navigate("TravelInProgress")
          }
          style={Profilestyles.edit_profile_button}
        >
          <Text style={Profilestyles.edit_button_text}>Volver Atras</Text>
        </Pressable>
      </View>
    </View >
  );
}
