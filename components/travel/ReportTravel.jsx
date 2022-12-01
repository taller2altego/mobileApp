import { useState } from "react";
import { MapStyles, TravelStyles, Profilestyles, ReportStyles } from "../styles";
import * as SecureStore from "expo-secure-store";
import { View, Text, TextInput, Pressable } from "react-native";
import { useFonts } from "expo-font";
import { authPost, handlerUnauthorizedError } from "../../utils/requests";
import envs from "../../config/env";

export default function ReportTravel({ route, navigation }) {
    // redux

    const [reportText, setReportText] = useState('');

    // states
    const [item, setItem] = useState(route.params);
    const { API_URL, GOOGLE_API_KEY } = envs;
    const [fontsLoaded] = useFonts({
        "poppins": require("../../assets/fonts/Poppins-Regular.ttf"),
        "poppins-bold": require("../../assets/fonts/Poppins-Bold.ttf"),
    });

    const sendReport = async (navigation) => {
        const id = await SecureStore.getItemAsync("id");
        const token = await SecureStore.getItemAsync("token");
        const data = {
            userId: id,
            driverId: item.driver,
            description: reportText
        };
        return authPost(`${API_URL}/reports`, token, data)
            .then(() => navigation.navigate("TripDetails", { travelId: item.travelId }))
            .catch(error => handlerUnauthorizedError(navigation, error))
    };

    const comeBack = (navigation) => {
        navigation.navigate("TripDetails", { travelId: item.travelId })
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={Profilestyles.profile_container}>
            <View style={ReportStyles.info_container}>
                <Text style={ReportStyles.destination_text}>{item.destination}</Text>
                <Text style={ReportStyles.other_info_text}>{item.dateTravel}</Text>
                <Text style={ReportStyles.other_info_text}>{item.driver}</Text>
            </View>
            <View style={ReportStyles.input_text}>
                <TextInput
                    style={ReportStyles.report_container}
                    placeholder="Escriba su denuncia aqui..."
                    onChangeText={newText => setReportText(newText)}
                    defaultValue={reportText}
                    maxLength={500}
                />
            </View>

            <View style={TravelStyles.travelContainer}>
                <View style={TravelStyles.buttonContainer}>
                    <Pressable
                        style={MapStyles.confirmTripButton}
                        onPress={() => comeBack(navigation)}
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
                <View style={TravelStyles.buttonContainer}>
                    <Pressable
                        style={MapStyles.confirmTripButton}
                        onPress={() => sendReport(navigation)}
                    >
                        <Text
                            style={{
                                fontFamily: "poppins-bold",
                                color: "white",
                                textAlign: "center",
                                lineHeight: 38,
                            }}
                        >
                            Enviar Denuncia
                        </Text>
                    </Pressable>
                </View>
            </View>

        </View>


    );
}
