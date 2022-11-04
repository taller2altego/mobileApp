import { useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MapStyles } from "../styles";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
import { View, Text, Pressable, Image } from "react-native";
import WaitingModal from "./Waiting";
import { useSelector } from "react-redux";
import { useFonts } from "expo-font";

export default function CreateTravel({ navigation }) {
  const currentTravelData = useSelector((store) => store.travelDetailsData);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [modalWaitingVisible, setModalWaitingVisible] = useState(false);
  const origin = currentTravelData.origin;
  const destination = currentTravelData.destination;
  const mapRef = useRef(null);
  const [fontsLoaded] = useFonts({
    "poppins": require("../../assets/fonts/Poppins-Regular.ttf"),
    "poppins-bold": require("../../assets/fonts/Poppins-Bold.ttf"),
  });

  const onDriverSearch = () => {
    navigation.navigate("DriverSearch");
  };

  const toggleWaitingModal = () => {
    setModalWaitingVisible(!modalWaitingVisible);
  };


  const updateTripProps = (args) => {
    if (args) {
      setDistance(args.distance.toFixed(2));
      setDuration(Math.ceil(args.duration));
    }
  };

  const zoomOnDirections = () => {
    mapRef.current.fitToSuppliedMarkers(["originMark", "destMark"], {
      animated: true,
      edgePadding: edgePadding,
    });
  };

  if (!fontsLoaded) {
    return null;
  }

//   return (
//     <View style={{ flex: 1, backgroundColor: "white" }}>
//       <WaitingModal
//         visible={modalWaitingVisible}
//         toggle={toggleWaitingModal}
//         navigation={navigation}
//       ></WaitingModal>
//       <MapView
//         ref={mapRef}
//         style={MapStyles.map}
//         provider={PROVIDER_GOOGLE}
//         onMapLoaded={() => {
//           zoomOnDirections();
//         }}
//         initialRegion={INITIAL_POSITION}
//       >
//         {origin && <Marker coordinate={origin} identifier="originMark" />}
//         {destination && (
//           <Marker coordinate={destination} identifier="destMark" />
//         )}
//         {origin && destination && (
//           <MapViewDirections
//             apikey={API_KEY}
//             origin={origin}
//             destination={destination}
//             strokeColor="black"
//             strokeWidth={5}
//             onReady={updateTripProps}
//           />
//         )}
//       </MapView>
//       <View style={MapStyles.tripInfoContainer}>
//         <View style={{ paddingLeft: 35 }}>
//           <Image
//             style={MapStyles.carImage}
//             source={{
//               uri: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_896,h_504/f_auto,q_auto/products/carousel/UberX.png",
//             }}
//           />
//         </View>
//         <View style={{ paddingRight: 20 }}>
//           <Text style={{ fontFamily: "poppins", fontSize: 15 }}>
//             {" "}
//             {duration} min{" "}
//           </Text>
//           <Text style={{ fontFamily: "poppins", fontSize: 15 }}>
//             {" "}
//             {distance} km
//           </Text>
//           <Text style={{ fontFamily: "poppins", fontSize: 15 }}>
//             {" "}
//             {distance * PRICE_PER_KM} ARS (est.)
//           </Text>
//         </View>
//       </View>
//       <Pressable style={MapStyles.confirmTripButton} onPress={() => setModalWaitingVisible(!modalWaitingVisible)} >
//         <Text
//           style={{
//             fontFamily: "poppins-bold",
//             color: "white",
//             textAlign: "center",
//             lineHeight: 38,
//           }}
//         >
//           Iniciar Viaje
//         </Text>
//       </Pressable>
//     </View >
//   );
}
