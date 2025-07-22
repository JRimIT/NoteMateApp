import { View, Text, StyleSheet } from "react-native";
import React, { use } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../NoteMate/contexts/ThemeContext";
import createProfileStyles from "../assets/styles/profile.styles";

const SafeScreen = ({ children }: any) => {
  const { colors } = useTheme();
  const styles = createProfileStyles(colors);

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {children}
    </View>
  );
};

export default SafeScreen;
