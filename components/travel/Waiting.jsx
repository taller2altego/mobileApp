import React, { useState, useEffect, useCallback } from "react";
import { ActivityIndicator, Modal, Text, View } from "react-native";
import { LandingStyles, modalStyles } from "../styles";

export default function WaitingDriverModal({ ...props }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1);
      console.log(seconds);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Modal animationType="slide" transparent={true} visible={props.visible}>
      <View style={modalStyles.modal_extern_view}>
        <View style={[modalStyles.modal_view]}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={[{ flex: 0.5 }]}>
              <Text style={{ fontSize: 32, padding: 60, paddingBottom: 10, textAlign: "center" }}>
                Buscando conductor para su viaje
              </Text>

            </View>
            <ActivityIndicator size={80} color="#000000" />
          </View>
        </View>
      </View>
    </Modal>
  );
}
