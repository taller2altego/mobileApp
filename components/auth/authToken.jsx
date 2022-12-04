import { useState } from "react";
import { MapStyles, TravelStyles, Profilestyles, RecoverStyles, LandingStyles } from "../styles";
import { View, Text, TextInput, Pressable, FlatList } from "react-native";
import { useFonts } from "expo-font";
import { authPost, handlerUnauthorizedError } from "../../utils/requests";
import envs from "../../config/env";

export default function AuthToken({ navigation }) {
    // redux

    const [token, setToken] = useState('');

    // states
    const { API_URL } = envs;
    const [fontsLoaded] = useFonts({
        "poppins": require("../../assets/fonts/Poppins-Regular.ttf"),
        "poppins-bold": require("../../assets/fonts/Poppins-Bold.ttf"),
    });

    const validateToken = (navigation) => {
        return authPost(`${API_URL}/auth`, token)
            .then(() => {
                navigation.navigate("ResetPassword", { token: token });
            })
            .catch(error => handlerUnauthorizedError(navigation, error))
    };

    const comeBack = (navigation) => {
        navigation.navigate("Landing");
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={Profilestyles.profile_container}>
            <View style={RecoverStyles.info_container}>
                <Text style={RecoverStyles.destination_text}>{ }</Text>
                <Text style={RecoverStyles.other_info_text}>{ }</Text>
                <Text style={RecoverStyles.other_info_text}>{ }</Text>
            </View>
            <View style={RecoverStyles.input_text}>
                <TextInput
                    style={RecoverStyles.input_text_container}
                    placeholder="Ingrese su token aqui..."
                    defaultValue=""
                    onChangeText={newText => setToken(newText)}
                    maxLength={500}
                />
            </View>

            <View style={LandingStyles.land_container_v2}>
                <View style={LandingStyles.land_buttons_container_v2}>
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
                <View style={LandingStyles.land_buttons_container_v2}>
                    <Pressable
                        style={MapStyles.confirmTripButton}
                        onPress={() => validateToken(navigation)}
                    >
                        <Text
                            style={{
                                fontFamily: "poppins-bold",
                                color: "white",
                                textAlign: "center",
                                lineHeight: 38,
                            }}
                        >
                            Validar Token
                        </Text>
                    </Pressable>
                </View>
            </View>

        </View>


    );
}
