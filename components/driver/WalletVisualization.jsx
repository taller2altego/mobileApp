import { useRef, useState, useEffect } from "react";
import { MapStyles, TravelStyles, Profilestyles, modalStyles } from "../styles";
import * as SecureStore from "expo-secure-store";
import { View, Text, TextInput, Pressable } from "react-native";
import { useSelector } from "react-redux";
import { useFonts } from "expo-font";
import { patch, get } from "../../utils/requests";
const API_KEY = "AIzaSyCa-kIrd3qRNKDJuHylT3VdLywUwWRbgXQ";
import envs from "../../config/env";

export default function WalletVisualization({ navigation }) {
    const [balance, setBalance] = useState(0);
    const [actualBalance, setActualBalance] = useState(0);
    const [isDriver, setIsDriver] = useState(false)
    // states
    const { API_URL } = envs;
    const [fontsLoaded] = useFonts({
        "poppins": require("../../assets/fonts/Poppins-Regular.ttf"),
        "poppins-bold": require("../../assets/fonts/Poppins-Bold.ttf"),
    });

    useEffect(() => {
        (async () => {
            const id = await SecureStore.getItemAsync("id");
            const token = await SecureStore.getItemAsync("token");
            await get(`${API_URL}/users/${id}`, token).then(async (user) => {
                if (user.data.driverId) {
                    setIsDriver(true);
                }
                await get(`${API_URL}/drivers/${user.data.driverId}`, token)
                    .then((data) => {
                        setActualBalance(data.data.balance);
                    });
            });
        })();
    }, []);

    const withdrawFunds = async (navigation) => {
        const id = await SecureStore.getItemAsync("id");
        const body = {
            userId: id,
            withdrawFunds: true,
            balance: balance
        };
        const token = await SecureStore.getItemAsync("token");
        return patch(`${API_URL}/drivers/${id}/payment`, token, body)
            .then(() => {
                navigation.navigate("Home");
            });
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={Profilestyles.profile_container}>
            <View style={Profilestyles.profile_container}>
                <Text style={Profilestyles.profile_visualization}>
                    Wallet
                </Text>
            </View>
            <View style={Profilestyles.profile_container}>
                <Text style={Profilestyles.profile_visualization}>
                    Saldo actual: {actualBalance} ethers
                </Text>
            </View>
            {(isDriver) && <TextInput
                style={[modalStyles.modal_input, { fontFamily: "poppins", width: 200, textAlign: "center" }]}
                placeholder="Cantidad"
                placeholderTextColor="#343437"
                keyboardType="numeric"
                onChangeText={(balance) => {
                    setBalance(balance);
                }}
            />}
            <View style={TravelStyles.travelContainer}>
                <View style={TravelStyles.buttonContainer}>
                    <Pressable
                        style={MapStyles.confirmTripButton}
                        onPress={() => navigation.navigate("Home")}
                    >
                        <Text
                            style={{
                                fontFamily: "poppins-bold",
                                color: "white",
                                textAlign: "center",
                                lineHeight: 38,
                            }}
                        >
                            Volver atras
                        </Text>
                    </Pressable>
                </View>
                {(isDriver) && <View style={TravelStyles.buttonContainer}>
                    <Pressable
                        style={MapStyles.confirmTripButton}
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
                    </Pressable>
                </View>}
            </View>

        </View>


    );
}
