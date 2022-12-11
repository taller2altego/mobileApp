import React, { useState, useCallback } from "react";
import { Text, View, FlatList } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useSelector } from "react-redux";
import { get, handlerUnauthorizedError } from "../../utils/requests";
import { TravelStyles, MapStyles } from "../styles";
import HomeTab from "./homeTab";
import envs from "../../config/env";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import CommentItem from "../travel/CommentItem";

export default function VisualizationTab({ navigation }) {
  // States
  const [name, setName] = useState();
  const [lastname, setLastName] = useState();
  const [driverScore, setDriverScore] = useState();
  const [driverPlate, setDriverPlate] = useState();
  const [driverCarModel, setDriverCarModel] = useState();
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [userIdDriver, setUserIdDriver] = useState();

  // Driver Data
  const currentTravelData = useSelector((store) => store.currentTravel);

  const { API_URL, _ } = envs;

  function renderItem({ item }) {
    const backgroundColor = item.id === selectedId ? "#f2f2f200" : "white";
    return (
      <CommentItem
        item={item}
        onPress={() => handleSelectedTrip(item)}
        backgroundColor={{ backgroundColor }}
      />
    );
  }

  useFocusEffect(useCallback(() => {
    (async () => {
      const token = await SecureStore.getItemAsync("token");
      await get(`${API_URL}/drivers/${currentTravelData.driverId}`, token).then(
        ({
          data: {
            totalScore,
            licensePlate,
            model,
            user: { name, lastname },
            userId,
          },
        }) => {
          setName(name);
          setLastName(lastname);
          setDriverScore(totalScore);
          setDriverPlate(licensePlate);
          setDriverCarModel(model);
          setUserIdDriver(userId);
        }
      ).catch(error => handlerUnauthorizedError(navigation, error));

      const id = await SecureStore.getItemAsync("id");
      const params = {
        page: 1,
        limit: 4,
      };
      await get(`${API_URL}/comments/driver/${userIdDriver}`, token)
        .then((data) => {
          setData(data.data.comments);
        })
        .catch(err => handlerUnauthorizedError(navigation, err));
    })();
  }, [userIdDriver]));

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
            {driverScore != 0 ? driverScore : "-"}
          </Text>
          <FontAwesome
            name="star"
            size={20}
            color="black"
            style={{ marginLeft: 4, marginTop: 4 }}
          />
        </View>
        <Text style={{ fontFamily: "poppins", fontSize: 25 }}>
          {driverPlate}
        </Text>
        <Text style={{ fontFamily: "poppins", fontSize: 25 }}>
          {driverCarModel}
        </Text>
      </View>
      <View style={{ flex: 3 }}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={selectedId}
        />
      </View>
    </View>
  );
}
