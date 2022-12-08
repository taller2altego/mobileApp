import { useRef, useState, useEffect } from "react";
import { MapStyles, TravelStyles, Profilestyles, modalStyles } from "../styles";
import * as SecureStore from "expo-secure-store";
import { View, Text, TextInput, Pressable } from "react-native";
import { useSelector } from "react-redux";
import { useFonts } from "expo-font";
import { patch, get } from "../../utils/requests";
const API_KEY = "AIzaSyCa-kIrd3qRNKDJuHylT3VdLywUwWRbgXQ";
import envs from "../../config/env";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from '@expo/vector-icons';

export default function WalletVisualization({ navigation }) {
  const [balance, setBalance] = useState(0);
  const [actualBalance, setActualBalance] = useState(0);
  const [fiuCreditos, setFiuCreditos] = useState(0);
  const [insufficientFunds, setInsufficientFunds] = useState(false);
  const [isDriver, setIsDriver] = useState(false)
  // states
  const { API_URL } = envs;

  useEffect(() => {
    (async () => {
      const id = await SecureStore.getItemAsync("id");
      const token = await SecureStore.getItemAsync("token");
      await get(`${API_URL}/users/${id}`, token).then(async (user) => {
        if (user.data.driverId) {
          setIsDriver(true);
          await get(`${API_URL}/drivers/${user.data.driverId}`, token)
            .then((data) => {
              setActualBalance(data.data.balance);
            });
        }
        setFiuCreditos(user.data.balance);
      });
    })();
  }, []);

  const withdrawFunds = async (navigation) => {
    const id = await SecureStore.getItemAsync("id");
    const body = {
      userId: id,
      withdrawFunds: true,
      isTransaction: true,
      balance: balance
    };
    const token = await SecureStore.getItemAsync("token");
    return patch(`${API_URL}/drivers/${id}/payment`, token, body)
      .then(() => {
        navigation.replace("Home");
      })
      .catch(() => {
        setInsufficientFunds(true);
      });
  };

  return (
    <View style={{padding: 10, justifyContent: "center", alignItems: "center"}}>
      <Ionicons
        name="arrow-back"
        size={30}
        color="black"
        style={{ position: "absolute", top: 20, left: 5 }}
        onPress={() => navigation.navigate("Home")}
      />
        <Text style={[Profilestyles.profile_visualization, {fontFamily: "poppins-bold", fontSize: 30, marginTop: "10%"}]}>
          Wallet
        </Text>
        <View style={{borderWidth: 2, alignItems: "center", justifyContent: "center", borderRadius: 5, width: "80%", padding: 15, marginTop: "20%"}}>
        <Text style={{fontFamily: "poppins-bold", fontSize: 20}}>FIU Creditos</Text>
        <View style={{flexDirection: "row"}}> 
        <Text style={{fontFamily: "poppins", marginRight: 5, marginBottom: 10 }}>
          {fiuCreditos}
        </Text>
        <FontAwesome5 name="ethereum" size={17} color="black" />
        </View>
        <Text style={{fontFamily: "poppins-bold", fontSize: 20}}>
          Ganancias
        </Text>
        <View style={{flexDirection: "row"}}> 
        <Text style={{fontFamily: "poppins", marginRight: 5 }}>
          {actualBalance}
        </Text>
        <FontAwesome5 name="ethereum" size={17} color="black" />
        </View>
      </View>
      {(isDriver) && <TextInput
        style={{ fontFamily: "poppins", width: 200, textAlign: "center", color: "black", borderColor: "black", borderWidth: 1, marginTop: "30%", marginBottom: "10%" }}
        placeholder="Cantidad"
        placeholderTextColor="#343437"
        keyboardType="numeric"
        onChangeText={(balance) => {
          setBalance(balance);
        }}
      />}
        {(isDriver) &&
          <Pressable
            style={{alignSelf: "center",
            width: 200,
            backgroundColor: "black",
            borderRadius: 5,}}
            onPress={() => withdrawFunds(navigation)}
          >
            <Text
              style={{
                fontFamily: "poppins-bold",
                color: "white",
                textAlign: "center",
                lineHeight: 38,
              }}
            >
              Retirar Fondos
            </Text>
          </Pressable>}
      {(insufficientFunds) && <View style={{ marginTop: 20 }}>
        <Text style={[Profilestyles.profile_visualization, { color: "red", fontFamily: "poppins" }]}>
          Fondos insuficientes
        </Text>
      </View>}
    </View>


  );
}
