import React, { useEffect } from "react";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useSelector, useDispatch } from "react-redux";

// modules
import { get, authPost } from "../../utils/requests";
import { setDriverId } from "../../redux/actions/UpdateCurrentTravel";
import { LandingStyles, modalStyles } from "../styles";
import envs from "../../config/env";
import { current } from "@reduxjs/toolkit";

export default function WaitingDriverModal({ navigation, ...props }) {
  // redux
  const currentTravelData = useSelector((store) => store.currentTravel);
  const travelId = currentTravelData._id;
  const dispatch = useDispatch();

  const { API_URL, GOOGLE_API_KEY } = envs;

  useEffect(() => {
    const interval = setInterval(async () => {
      const token = await SecureStore.getItemAsync("token");

      await get(`${API_URL}/travels/${travelId}/driver`, token).then(
        ({ data }) => {
          if (data.data.driverId) {
            dispatch(setDriverId({ driverId: data.data.driverId }));
            navigation.navigate("DriverIncoming");
          }
        }
      );
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const cancelSearch = async () => {
    const token = await SecureStore.getItemAsync("token");
    const travel = await get(`${API_URL}/travels/${travelId}`, token).catch(err => {
      console.log(err);
    });
    return get(`${API_URL}/drivers/${travel.data.driverId}`, token)
      .then((driver) => {
        return get(`${API_URL}/users/${driver.data.userId}`, token)
          .then((user) => {
            const body = {
              email: user.data.email,
              price: travel.data.price,
            };
            return authPost(`${API_URL}/travels/${travelId}/reject?isTravelCancelled='true'`, token, body).then(navigation.navigate("Home"));
          })
      })
  };

  return (
    <Modal animationType="slide" transparent={true} visible={props.visible}>
      <View style={modalStyles.modal_extern_view}>
        <View style={[modalStyles.modal_view]}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={[{ flex: 1 }]}>
              <Text
                style={{
                  fontSize: 32,
                  padding: 50,
                  textAlign: "center",
                  fontFamily: "poppins",
                }}
              >
                Buscando conductor para su viaje
              </Text>
              <ActivityIndicator
                size={50}
                color="#000000"
                style={{ marginTop: 50 }}
              />
              <Pressable onPress={cancelSearch} style={{ marginTop: 100 }}>
                <Text
                  style={[
                    LandingStyles.textButton,
                    { fontFamily: "poppins", color: "black" },
                  ]}
                >
                  {" "}
                  Cancelar Busqueda
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
