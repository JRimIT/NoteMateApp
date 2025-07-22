// styles/detail.styles.ts
import { StyleSheet } from "react-native";
import { ThemeType } from "../../themes/theme";

const createDetailStyles = (colors: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    input: {
      flex: 1,
      fontSize: 16,
      textAlignVertical: "top",
      minHeight: 300,
      color: colors.textPrimary,
    },
    AIbutton: {
      backgroundColor: colors.primary,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: 120,
      padding: 10,
      borderRadius: 10,
    },
    bookCard: {
      flex: 1,
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      marginBottom: 20,
      padding: 10,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    footer: {
      backgroundColor: colors.inputBackground,
      borderRadius: 16,
      marginBottom: 20,
      padding: 16,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
    },
    header: {
      marginBottom: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 10,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: "JetBrainsMono-Medium",
      letterSpacing: 0.5,
      color: colors.primary,
      marginBottom: 8,
    },
    buttonSubmit: {
      backgroundColor: colors.back,
      justifyContent: "center",
      alignItems: "center",
      height: 35,
      paddingHorizontal: 10,
      borderRadius: 10,
    },
  });

export default createDetailStyles;
