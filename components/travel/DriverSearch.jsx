import { useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MapStyles } from "../styles";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
import { View, Text, Pressable, Image } from "react-native";
import { useSelector } from "react-redux";
import { useFonts } from "expo-font";
import MyLoader from "../main/ContentLoader";

export default function DriverSearch() {
  // const currentTravelData = useSelector((store) => store.travelDetailsData);
  // const [distance, setDistance] = useState(0);
  // const [duration, setDuration] = useState(0);
  // const origin = currentTravelData.origin;
  // const destination = currentTravelData.destination;
  // const mapRef = useRef(null);
  // const [fontsLoaded] = useFonts({
  //   poppins: require("../../assets/fonts/Poppins-Regular.ttf"),
  //   "poppins-bold": require("../../assets/fonts/Poppins-Bold.ttf"),
  // });

  // const onDriverSearch = () => {
  //   navigation.navigate("DriverSearch");
  // };

  // const updateTripProps = (args) => {
  //   if (args) {
  //     setDistance(args.distance.toFixed(2));
  //     setDuration(Math.ceil(args.duration));
  //   }
  // };

  // const zoomOnDirections = () => {
  //   mapRef.current.fitToSuppliedMarkers(["originMark", "destMark"], {
  //     animated: true,
  //     edgePadding: edgePadding,
  //   });
  // };

  // if (!fontsLoaded) {
  //   return null;
  // }

  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <View style={[{ flex: 0.5 }]}>
        <Text style={{ fontSize: 32, padding: 25, paddingBottom: 10 }}>
          Buscando conductor
        </Text>
        <View>
          <MyLoader/>  
        </View>
      </View>
    </View >
  );
}
