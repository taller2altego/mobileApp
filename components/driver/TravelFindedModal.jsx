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

  return (
    <Modal animationType="slide" transparent={false} visible={props.visible}>
      <View style={[modalStyles.modal_extern_view, { fontFamily: "poppins" }]}>
        <View style={[modalStyles.modal_view, { fontFamily: "poppins" }]}>
          <Pressable onPress={props.toggleAccept}>
            <Entypo name="cross" size={24} color="black" />
          </Pressable>
          <View style={[modalStyles.flex_modal]}>
            <Text style={{ fontSize: 25, alignSelf: "center", color: "white" }}>
              {" "}
              {travelDetailsData.originAddress}
            </Text>
            <Text style={{ fontSize: 25, alignSelf: "center", color: "white" }}>
              {" "}
              {travelDetailsData.destinationAddress}{" "}
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Pressable style={[modalStyles.modal_button, {
                width: (45 * Dimensions.get("window").width) / 100,
                alignItems: "center", justifyContent: "center",
                marginLeft: 6
              }]} onPress={props.toggle}>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>Volver</Text>
              </Pressable>
              <Pressable style={[modalStyles.modal_button, {
                width: (45 * Dimensions.get("window").width) / 100,
                alignItems: "center", justifyContent: "center",
                marginRight: 6
              }]} onPress={acceptTravel}>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}> Aceptar Viaje </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
