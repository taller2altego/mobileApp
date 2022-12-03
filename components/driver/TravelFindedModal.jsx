import React, { useEffect } from "react";
import { Pressable, Modal, Text, View } from "react-native";
import { Entypo } from "@expo/vector-icons";

import { LandingStyles, modalStyles } from "../styles";
import { useSelector } from "react-redux";
import { authPost } from "../../utils/requests";
import * as SecureStore from "expo-secure-store";
import envs from "../../config/env";

export default function TravelFindedModal({
  navigation,
  setModalTravelFindedVisible,
  ...props
}) {
  const { API_URL, _ } = envs;
  const travelDetailsData = useSelector((store) => store.travelDetailsData);
  const currentTravel = useSelector((store) => store.currentTravel);
  const travelData = useSelector((store) => store.currentTravel);

  const acceptTravel = async () => {
    const id = await SecureStore.getItemAsync("id");
    const token = await SecureStore.getItemAsync("token");
    // FIXME sacar el id del viaje hardcodeado
    return authPost(`${API_URL}/travels/${travelData._id}/accept`, token, {
      driverId: id,
      currentDriverPosition: travelDetailsData.origin
    })
    .then(() => navigation.navigate("TravelInProgressDriver"));
  };

  return (
    <Modal animationType="slide" transparent={false} visible={props.visible}>
      <View style={[modalStyles.modal_extern_view, { fontFamily: "poppins" }]}>
        <View style={[modalStyles.modal_view, { fontFamily: "poppins" }]}>
          <Pressable onPress={props.toggle}>
            <Entypo name="cross" size={24} color="black" />
          </Pressable>
          <View style={[modalStyles.flex_modal]}>
            <Text style={{ fontSize: 25, alignSelf: "center" }}>
              {" "}
              {travelDetailsData.originAddress}
            </Text>
            <Text style={{ fontSize: 25, alignSelf: "center" }}>
              {" "}
              {travelDetailsData.destinationAddress}{" "}
            </Text>
            <Pressable style={{ alignSelf: "center" }} onPress={acceptTravel}>
              <Text style={{ fontSize: 25 }}> Aceptar Viaje </Text>
            </Pressable>

            <Pressable style={{ alignSelf: "center" }} onPress={props.toggle}>
              <Text style={{ fontSize: 25 }}>Volver</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
