import React, { useState } from "react";
import { View, FlatList, Button, StyleSheet, Text, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import moment from "moment";

import { Homestyles } from "../styles";

import TravelItem from './TravelItem';
import MapViewDirections from "react-native-maps-directions";


const API_KEY = "AIzaSyCa-kIrd3qRNKDJuHylT3VdLywUwWRbgXQ";

const DATA = [
  { id: 1, price: 1500, source: 'Calle siempre viva 123', destination: 'asd 1234', date: "2022-08-01T03:01" },
  { id: 2, price: 1500, source: 'Calle siempre viva 123', destination: 'gfd 1234', date: "2022-08-01T13:00" },
  { id: 3, price: 1500, source: 'Calle siempre viva 123', destination: 'nbvc 1234', date: "2022-06-01T20:00" },
  { id: 4, price: 1500, source: 'Calle siempre viva 123', destination: '23q4 1234', date: "2022-05-01T20:00" }
];

const Item = ({ item, onPress, backgroundColor, textColor }) => {

  const months = {
    January: 'Enero',
    February: 'Febrero',
    March: 'Marzo',
    April: 'Abril',
    May: 'Mayo',
    June: 'Junio',
    July: 'Julio',
    August: 'Agosto',
    September: 'Septiembre',
    October: 'Octubre',
    November: 'Noviembre',
    December: 'Diciembre'
  }

  const a = moment(item.date);
  const ampm = a.minutes() > 12 ? 'PM' : 'AM';
  const minutes = a.format('mm');
  const hours = a.format('HH');
  const month = a.format('MMMM');
  const day = a.day();

  return (
    <TouchableOpacity style={[styles.item, backgroundColor]} onPress={onPress} >
      <Text style={[styles.title, textColor]}>{`${item.destination}`}</Text>
      <Text style={[styles.subtitle, textColor]}>{`$${item.price}`}</Text>
      <Text style={[styles.subtitle, textColor]}>{`${day} ${months[month]} - ${hours}:${minutes} ${ampm}`}</Text>
    </TouchableOpacity>
  )
};


export default function HomeTab() {
  // const mapRef = useRef(null);
  // const [origin, setOrigin] = useState("");
  // const [destination, setDestination] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const renderItem = ({ item, index }) => {
    const backgroundColor = item.id === selectedId ? "#f2f2f200" : "white";

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={{ backgroundColor }}
      />
    );
  };

  return (
    <View style={[styles.container, { flexDirection: "column" }]} keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
      <KeyboardAwareScrollView>
        <View style={[{ flex: 0.3 }]}></View>
        <View style={[{ flex: 0.5 }]}>
          <Text style={{ fontSize: 32, padding: 25, paddingBottom: 10 }}>Actividades</Text>
        </View>
        <View style={[{ flex: 0.2 }]}></View>

        <View style={{ flex: 3 }}>
          <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            extraData={selectedId}
          />
        </View>

        <View style={[{ flex: 1, padding: 20 }]}>
          <GooglePlacesAutocomplete
            styles={{ textInput: Homestyles.searchInput, flex: 1 }}
            placeholder="Punto de partida"
            fetchDetails
            onPress={(data, details) => {
              handleLocation(details, "origin");
            }}
            query={{
              key: API_KEY,
              language: "en",
            }}
          />
          <GooglePlacesAutocomplete
            styles={{ textInput: Homestyles.searchInput, flex: 1 }}
            placeholder="Punto de llegada"
            fetchDetails
            onPress={(data, details) => {
              handleLocation(details, "destination");
            }}
            query={{
              key: API_KEY,
              language: "en",
            }}
          />

          <Button
            title="Confirmar viaje"
            color="#696c6e"
            onPress={() => Alert.alert('Button with adjusted color pressed')}
          />

        </View>
      </KeyboardAwareScrollView >
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    padding: 20,
    marginVertical: 4
  },
  title: {
    fontSize: 26,
  },
  subtitle: {
    fontSize: 14
  }
});