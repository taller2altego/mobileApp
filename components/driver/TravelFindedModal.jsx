import React from "react";
import { Pressable, Modal, Text, View, Dimensions } from "react-native";
import { Entypo } from "@expo/vector-icons";

import { modalStyles } from "../styles";
import { useSelector } from "react-redux";
import { authPost, handlerUnauthorizedError } from "../../utils/requests";
import * as SecureStore from "expo-secure-store";
import envs from "../../config/env";

export default function TravelFindedModal({ navigation, setModalTravelFindedVisible, ...props }) {
  const { API_URL, _ } = envs;
  const travelDetailsData = useSelector((store) => store.travelDetailsData);
  const currentTravel = useSelector((store) => store.currentTravel);

  const acceptTravel = async () => {

    const id = await SecureStore.getItemAsync("id");
    const driverId = await SecureStore.getItemAsync("driverId");
    const token = await SecureStore.getItemAsync("token");
    await SecureStore.setItemAsync("updatingLocation", JSON.stringify({ updating: "true" }));

    const body = {
      driverId: driverId,
      currentDriverPosition: travelDetailsData.origin
    };
    props.toggleAccept()
    return authPost(`${API_URL}/travels/${currentTravel._id}/accept`, token, body)
      .then(() => navigation.navigate("TravelInProgressDriver"))
      .catch(error => handlerUnauthorizedError(navigation, error));
  };

  const rejectTravel = async () => {
    await SecureStore.deleteItemAsync("updatingLocation");
    props.toggleCancel()
  }

  return (
    <Modal animationType="slide" transparent={true} visible={props.visible}>
      <View style={[modalStyles.modal_extern_view, { fontFamily: "poppins" }]}>
        <View style={[modalStyles.modal_view_find, { fontFamily: "poppins" }]}>
          <View style={{padding: 5}}>
            <View style={{marginBottom: "10%", marginTop: "5%"}}>
          <Text style={{ fontSize: 20, alignSelf: "center", color: "black", fontFamily: "poppins" }}>
              Origen
            </Text>
            <Text style={{ fontSize: 20, alignSelf: "center", color: "black", fontFamily: "poppins" }}>
              {travelDetailsData.originAddress}
            </Text>
            </View>
            <View>
            <Text style={{ fontSize: 20, alignSelf: "center", color: "black", fontFamily: "poppins"}}>
              Destino
            </Text>
            <Text style={{ fontSize: 20, alignSelf: "center", color: "black", fontFamily: "poppins" }}>
              {travelDetailsData.destinationAddress}
            </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: "20%" }}>
              <Pressable style={[modalStyles.modal_button, {
                width: (45 * Dimensions.get("window").width) / 100,
                alignItems: "center", justifyContent: "center",
                marginLeft: 6
              }]} onPress={rejectTravel}>
                <Text style={{ fontSize: 20, color: "white", fontFamily: "poppins"  }}>Rechazar</Text>
              </Pressable>
              <Pressable style={[modalStyles.modal_button, {
                width: (45 * Dimensions.get("window").width) / 100,
                alignItems: "center", justifyContent: "center",
                marginRight: 6
              }]} onPress={acceptTravel}>
                <Text style={{ fontSize: 20, color: "white", fontFamily: "poppins"  }}> Aceptar Viaje </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
