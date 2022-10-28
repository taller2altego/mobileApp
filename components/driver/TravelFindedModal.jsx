import React, { useEffect } from "react";
import { Pressable, Modal, Text, View } from "react-native";
import { Entypo } from "@expo/vector-icons";

import { LandingStyles, modalStyles } from "../styles";

export default function WaitingDriverModal({ navigation, setModalTravelFindedVisible, ...props }) {

  return (
    <Modal animationType="slide" transparent={false} visible={props.visible}>
      <View style={[modalStyles.modal_extern_view, { fontFamily: "poppins" }]}>
        <View style={[modalStyles.modal_view, { fontFamily: "poppins" }]}>
          <Pressable onPress={props.toggle}>
            <Entypo name="cross" size={24} color="black" />
          </Pressable>
          <View style={[modalStyles.flex_modal]}>
            <Pressable
              style={modalStyles.modal_button}
              onPress={() => { navigation.navigate("TravelInProgressDriver"); }}>
              <Text> Aceptar Viaje </Text>
            </Pressable>

            <Pressable
              style={modalStyles.modal_button}
              onPress={props.toggle}>
              <Text>
                Volver
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}






