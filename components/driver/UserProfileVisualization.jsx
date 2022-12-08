import React, { useState, useCallback } from "react";
import { Text, View, FlatList, Pressable } from "react-native";
import * as SecureStore from "expo-secure-store";
import { get } from "../../utils/requests";
import envs from "../../config/env";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { MapStyles, TravelStyles } from "../styles";
import CommentItem from "../travel/CommentItem";
import { useSelector } from "react-redux";

export default function VisualizationTab({ navigation }) {
  // States
  const [name, setName] = useState();
  const [lastname, setLastName] = useState();
  const [userScore, setUserScore] = useState();
  const [data, setData] = useState([]);
  const currentTravelData = useSelector((store) => store.currentTravel);
  const travelId = currentTravelData._id;
  const userId = currentTravelData.userId;

  const { API_URL, _ } = envs;

  function renderItem({ item }) {
    return <CommentItem item={item} backgroundColor={"white"} />;
  }

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const token = await SecureStore.getItemAsync("token");

        await get(`${API_URL}/users/${userId}`, token).then(
          ({ data: { name, lastname, totalScore } }) => {
            setName(name);
            setLastName(lastname);
            setUserScore(totalScore);
          }
        );

        await get(`${API_URL}/comments/user/${userId}`, token).then((data) => {
          setData(data.data.comments);
        });
      })();
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      <Ionicons
        name="arrow-back"
        size={24}
        color="black"
        style={{ alignSelf: "flex-start", top: 40, left: 10 }}
        onPress={() => navigation.goBack()}
      />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontFamily: "poppins", fontSize: 25 }}>
          {name} {lastname}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontFamily: "poppins", fontSize: 25 }}>
            {userScore > 0 ? userScore.toFixed(1) : "-"}
          </Text>
          <FontAwesome
            name="star"
            size={20}
            color="black"
            style={{ marginLeft: 4, marginTop: 4 }}
          />
        </View>
      </View>
      <View style={{ flex: 3 }}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View style={TravelStyles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            MapStyles.confirmTripButton,
            { backgroundColor: pressed ? "#333" : "black" },
          ]}
          onPress={() => navigation.navigate("Home")}
        >
          <Text
            style={{
              fontFamily: "poppins-bold",
              color: "white",
              textAlign: "center",
              lineHeight: 38,
            }}
          >
            Continuar
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            MapStyles.confirmTripButton,
            { backgroundColor: pressed ? "#333" : "black" },
          ]}
          onPress={() => {
            navigation.navigate("RateUser");
          }}
        >
          <Text
            style={{
              fontFamily: "poppins-bold",
              color: "white",
              textAlign: "center",
              lineHeight: 38,
            }}
          >
            Puntuar Pasajero
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
