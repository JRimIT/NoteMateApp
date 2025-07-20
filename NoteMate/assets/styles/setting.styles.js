import { StyleSheet } from "react-native";
import COLORS from "../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ede1d1",
    paddingHorizontal: 20,
  },
  backButton: {
    marginTop: 40,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardRow: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold", // In đậm Username & Email
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginTop: 4,
  },
  input: {
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f0e6dd",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 4,
    width: "100%",
    paddingRight: 40,
  },
  inputPasswordWrapper: {
    position: "relative",
    marginTop: 12,
  },
  inputPassword: {
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f0e6dd",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    width: "100%",
    paddingRight: 40, // để tránh icon đè
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: -40,
  },
  createPassword: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  logoutBtn: {
    backgroundColor: "#e17156",
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: "#e17156",
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: {
    color: COLORS.white,
    fontWeight: "bold",
    marginLeft: 16,
  },
  deleteBtn: {
    marginTop: 16,
    alignSelf: "center",
  },
  deleteText: {
    color: "red",
    fontWeight: "500",
    fontSize: 14,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
  },
  cancelButton: {
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#ccc",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  inputIcon: { marginRight: 10 },

  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#e17156",
  },
  saveText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    marginBottom: 12,
  },

  inputIcon: {
    marginLeft: 8,
  },
});
export default styles;
