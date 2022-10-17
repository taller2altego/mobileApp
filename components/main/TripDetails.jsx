import { useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MapStyles } from "../styles";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
import { View, Text, Pressable, Image } from "react-native";
import { useSelector } from "react-redux";
import { useFonts } from "expo-font";
import { Rating } from "react-native-ratings";

const API_KEY = "AIzaSyCa-kIrd3qRNKDJuHylT3VdLywUwWRbgXQ";

const DATA = {
  origin: "Origen 1",
  destination: "Destino 1",
  cost: 1002,
  driver: "Conductor 1",
  car: "Auto 1",
  date: "Fecha 1",
};

const handleRating = (rating) => {
  console.log(rating)
}

export default function TripDetails() {
  const [fontsLoaded] = useFonts({
    poppins: require("../../assets/fonts/Poppins-Regular.ttf"),
    "poppins-bold": require("../../assets/fonts/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <View>
          <Text style={{ fontFamily: "poppins", fontSize: 20 }}>
            {DATA.destination}
          </Text>
          <Text style={{ fontFamily: "poppins", fontSize: 20 }}>
            {DATA.origin}
          </Text>
        </View>
        <View>
          <Text style={{ fontFamily: "poppins", fontSize: 20 }}>
            {DATA.cost}
          </Text>
          <Text style={{ fontFamily: "poppins", fontSize: 20 }}>
            {DATA.driver}
          </Text>
          <Text style={{ fontFamily: "poppins", fontSize: 20 }}>
            {DATA.car}
          </Text>
          <Text style={{ fontFamily: "poppins", fontSize: 20 }}>
            {DATA.date}
          </Text>
        </View>
      </View>
      <Rating
        style={{alignSelf: "center", paddingBottom: 60}}
        type="custom"
        ratingCount={5}
        imageSize={40}
        ratingBackgroundColor="white"
        ratingColor="black"
        tintColor="grey"
        startingValue={0}
        fractions={1}
        onFinishRating={(rating) => handleRating(rating)}
      />
    </View>
  );
}
