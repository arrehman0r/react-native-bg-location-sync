import React, { useState } from "react";
import { View, StyleSheet, Platform, Pressable } from "react-native";
import { Icon, Text } from "react-native-paper";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { MaterialCommunityIcons } from "@expo/vector-icons";

export const AppDatePicker = ({
  label,
  value,
  onChange,
  mode = "date",
  minimumDate,
  maximumDate,
  disabled,
}) => {
  const [show, setShow] = useState(false);

  const handleChange = (event, selectedDate) => {
    setShow(false);
    if (event.type === "set" && selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        onPress={() => !disabled && setShow(true)}
        style={styles.input}
      >
        {/* <MaterialCommunityIcons
          name="calendar"
          size={20}
          color="#565656"
          style={styles.icon}
        /> */}
        <Text style={styles.inputText}>
          {value ? value.toLocaleDateString() : "Select date"}
        </Text>
      </Pressable>

      {/* {show && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "NunitoSans_500Medium",
    marginBottom: 8,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F9FAFB",
  },
  icon: {
    marginRight: 8,
  },
  inputText: {
    fontSize: 14,
    fontFamily: "NunitoSans_400Regular",
    color: "#000",
  },
});
