import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Button,
  StyleSheet,
  Text,
  ScrollView,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { getWithQuerys } from "../../utils/requests";
import * as SecureStore from "expo-secure-store";
import { Homestyles } from "../styles";
const API_KEY = "AIzaSyCa-kIrd3qRNKDJuHylT3VdLywUwWRbgXQ";
import TravelItem from "./TravelItem";
import { useDispatch } from "react-redux";
import {
  setDestination,
  setOrigin,
} from "../../redux/actions/UpdateTravelDetails";

// const DATA = [
//   {
//     id: 1,
//     price: 1500,
//     source: "Calle siempre viva 123",
//     destination: "asd 1234",
//     date: "2022-08-01T03:01",
//   },
//   {
//     id: 2,
//     price: 1500,
//     source: "Calle siempre viva 123",
//     destination: "gfd 1234",
//     date: "2022-08-01T13:00",
//   },
//   {
//     id: 3,
//     price: 1500,
//     source: "Calle siempre viva 123",
//     destination: "nbvc 1234",
//     date: "2022-06-01T20:00",
//   },
//   {
//     id: 4,
//     price: 1500,
//     source: "Calle siempre viva 123",
//     destination: "23q4 1234",
//     date: "2022-05-01T20:00",
//   },
// ];

export default function HomeTab({ navigation }) {
  const [srcDetails, setSrcDetails] = useState("");
  const [destDetails, setDestDetails] = useState("");
  const [data_travels, setData] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const dispatch = useDispatch();

  function renderItem({ item }) {
    const backgroundColor = item.id === selectedId ? "#f2f2f200" : "white";
    return (
      <TravelItem
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={{ backgroundColor }}
      />
    );
  }

  useEffect(() => {
    (async () => {
      const id = await SecureStore.getItemAsync("id");
      const token = await SecureStore.getItemAsync("token");
      const params = {
          page: 1,
          offset: 4
      };

      await getWithQuerys(`http://10.0.2.2:5000/travels/${id}`, params, token)
        .then(
          ({ data: { data } }) => {
            console.log("DATA");
            console.log(data);
            setData(data);
          }
        );
    })();
  }, []);

  const onConfirmationTravel = () => {
    dispatch(setOrigin({ origin: srcDetails }));
    dispatch(setDestination({ destination: destDetails }));
    navigation.navigate("ConfirmationTravel");
  };

  return (
    <View
      style={[styles.container, { flexDirection: "column" }]}
      keyboardShouldPersistTaps={"always"}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView keyboardShouldPersistTaps={"handled"}>
        <ScrollView keyboardShouldPersistTaps={"handled"}>
          <View style={[{ flex: 0.3 }]}></View>
          <View style={[{ flex: 0.5 }]}>
            <Text style={{ fontSize: 32, padding: 25, paddingBottom: 10 }}>
              Actividades
            </Text>
          </View>
          <View style={[{ flex: 0.2 }]}></View>

          <View style={{ flex: 3 }}>
            {/* {DATA.map(travel => renderItem({ travel }))} */}
            <FlatList
              data={data_travels}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              extraData={selectedId}
            />
          </View>

          <View style={[{ flex: 1, padding: 20 }]}>
            <GooglePlacesAutocomplete
              styles={{ textInput: Homestyles.searchInput, flex: 1 }}
              placeholder="Punto de partida"
              fetchDetails
              onPress={(data, details) => {
                setSrcDetails({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                });
              }}
              query={{
                key: API_KEY,
                language: "en",
              }}
            />
            <GooglePlacesAutocomplete
              styles={{ textInput: Homestyles.searchInput, flex: 1 }}
              placeholder="Punto de llegada"
              fetchDetails
              onPress={(data, details) => {
                setDestDetails({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                });
              }}
              query={{
                key: API_KEY,
                language: "en",
              }}
            />
            <Button
              title="Confirmar viaje"
              color="#696c6e"
              onPress={() => onConfirmationTravel()}
            />
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
