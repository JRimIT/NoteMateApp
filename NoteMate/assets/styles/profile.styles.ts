// styles/profile.styles.js
import { StyleSheet } from "react-native";
import { ThemeType } from "../../themes/theme";

const createProfileStyles = (colors: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
      paddingBottom: 0,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    profileHeader: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: 16,
    },
    profileInfo: {
      flex: 1,
    },
    username: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    email: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    memberSince: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    logoutButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    logoutText: {
      color: colors.white,
      fontWeight: "600",
      marginLeft: 8,
    },
    booksHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    booksTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    booksCount: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    booksList: {
      paddingBottom: 20,
    },
    bookItem: {
      flexDirection: "row",
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    bookImage: {
      width: 70,
      height: 100,
      borderRadius: 8,
      marginRight: 12,
    },
    bookInfo: {
      flex: 1,
      justifyContent: "space-between",
    },
    bookTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    ratingContainer: {
      flexDirection: "row",
      marginBottom: 4,
    },
    bookCaption: {
      fontSize: 14,
      color: colors.textDark,
      marginBottom: 4,
      flex: 1,
    },
    bookDate: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    deleteButton: {
      padding: 8,
      justifyContent: "center",
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
      marginTop: 20,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
      marginTop: 16,
      marginBottom: 20,
      textAlign: "center",
    },
    addButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 20,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    addButtonText: {
      color: colors.white,
      fontWeight: "600",
      fontSize: 14,
    },

    avatar: {
      width: 70,
      height: 70,
      borderRadius: 35,
      marginRight: 12,
      borderWidth: 2,
      borderColor: "#4f46e5",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },

    modalContent: {
      backgroundColor: colors.white,
      width: "85%",
      borderRadius: 16,
      padding: 20,
      elevation: 10,
    },

    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: 12,
      textAlign: "center",
    },

    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      padding: 10,
      marginBottom: 12,
      fontSize: 14,
      color: colors.textPrimary,
    },

    modalButtons: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 10,
    },

    saveButton: {
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginLeft: 10,
    },

    saveButtonText: {
      color: colors.white,
      fontWeight: "bold",
      fontSize: 14,
    },

    cancelButton: {
      backgroundColor: colors.border,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
    },

    cancelButtonText: {
      color: colors.textPrimary,
      fontWeight: "bold",
      fontSize: 14,
    },
    statsText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    statsContainer: {
      marginTop: 8,
      paddingVertical: 6,
      paddingHorizontal: 10,
      backgroundColor: "#f0f0f0",
      borderRadius: 8,
    },
  });

export default createProfileStyles;
