import { View, Text, Pressable, Image } from "react-native";
import MyLoader from "../main/ContentLoader";

export default function TravelSearch() {




  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <View style={[{ flex: 0.5 }]}>
        <Text style={{ fontSize: 32, padding: 25, paddingBottom: 10 }}>
          Buscando conductor
        </Text>
        <View>
          <MyLoader/>  
        </View>
      </View>
    </View >
  );
}