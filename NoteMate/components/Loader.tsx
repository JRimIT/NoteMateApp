import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { useTheme } from "../../NoteMate/contexts/ThemeContext";
import createProfileStyles from "../assets/styles/profile.styles";

const Loader = () => {
  const { colors } = useTheme();
  const styles = createProfileStyles(colors);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
      }}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

export default Loader;
