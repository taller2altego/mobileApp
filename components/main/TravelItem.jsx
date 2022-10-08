import React, { useState } from "react";

import { StyleSheet, Text, TouchableOpacity } from "react-native";
import moment from "moment";

export default function TravelItem({
  item,
  onPress,
  backgroundColor,
  textColor,
}) {
  const months = {
    January: "Enero",
    February: "Febrero",
    March: "Marzo",
    April: "Abril",
    May: "Mayo",
    June: "Junio",
    July: "Julio",
    August: "Agosto",
    September: "Septiembre",
    October: "Octubre",
    November: "Noviembre",
    December: "Diciembre",
  };

  const a = moment(item.date);
  const ampm = a.minutes() > 12 ? "PM" : "AM";
  const minutes = a.format("mm");
  const hours = a.format("HH");
  const month = a.format("MMMM");
  const day = a.day();

  return (
    <TouchableOpacity style={[styles.item, backgroundColor]} onPress={onPress}>
      <Text style={[styles.title, textColor]}>{`${item.destination}`}</Text>
      <Text style={[styles.subtitle, textColor]}>{`$${item.price}`}</Text>
      <Text
        style={[styles.subtitle, textColor]}
      >{`${day} ${months[month]} - ${hours}:${minutes} ${ampm}`}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 20,
    marginVertical: 4,
  },
  title: {
    fontSize: 26,
  },
  subtitle: {
    fontSize: 14,
  },
});
