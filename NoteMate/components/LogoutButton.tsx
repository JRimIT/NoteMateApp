import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../../NoteMate/contexts/ThemeContext";
import createProfileStyles from "../assets/styles/profile.styles";

const LogoutButton = () => {
  const { colors } = useTheme();
  const styles = createProfileStyles(colors);

  const { logout } = useAuthStore();

  const confirmLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => logout(),
        style: "destructive",
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
      <Text style={styles.logoutText}>LOGOUT</Text>
      <Ionicons
        name="log-out-outline"
        size={20}
        color={colors.white}
        style={{ marginLeft: 8 }}
      />
    </TouchableOpacity>
  );
};

export default LogoutButton;
