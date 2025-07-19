import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../../assets/styles/setting.styles";
import COLORS from "../../constants/colors";

const Setting = ({ navigation }: any) => {
  const [offlineMode, setOfflineMode] = useState(true);
  const [pushNotification, setPushNotification] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [editingField, setEditingField] = useState<null | "username" | "email">(
    null
  );
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogout = () => {
    Alert.alert("Logout", "You have been logged out.");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?",
      [{ text: "Cancel" }, { text: "Delete", style: "destructive" }]
    );
  };

  const handleSaveField = (field: "username" | "email") => {
    setEditingField(null);
    Alert.alert("Saved", `${field} updated successfully.`);
    // Add API call here if needed
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirmation do not match.");
      return;
    }

    // Add your API call here
    Alert.alert("Success", "Password changed successfully.");
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.profile()}
      >
        <Ionicons name="arrow-back" size={20} color="black" />
      </TouchableOpacity>

      <Text style={styles.header}>Settings</Text>

      {/* Personal Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.card}>
          {/* Username */}
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Username</Text>
              {editingField === "username" ? (
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                />
              ) : (
                <Text style={styles.value}>{username}</Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() =>
                editingField === "username"
                  ? handleSaveField("username")
                  : setEditingField("username")
              }
            >
              <Feather
                name={editingField === "username" ? "check" : "edit-2"}
                size={18}
                color="black"
              />
            </TouchableOpacity>
          </View>

          {/* Email */}
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Email</Text>
              {editingField === "email" ? (
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                />
              ) : (
                <Text style={styles.value}>{email}</Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() =>
                editingField === "email"
                  ? handleSaveField("email")
                  : setEditingField("email")
              }
            >
              <Feather
                name={editingField === "email" ? "check" : "edit-2"}
                size={18}
                color="black"
              />
            </TouchableOpacity>
          </View>

          {/* Change Password */}
          <View style={styles.row}>
            <Text style={styles.createPassword}>Change Password</Text>
            <TouchableOpacity onPress={() => setShowPasswordModal(true)}>
              <Feather name="edit-2" size={18} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Offline Studying */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Offline Studying</Text>
        <View style={styles.cardRow}>
          <Text style={styles.value}>Save sets for offline Studying</Text>
          <Switch
            value={offlineMode}
            onValueChange={setOfflineMode}
            trackColor={{ true: "#e17156", false: "#ccc" }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.value}>Push notification</Text>
            <Switch
              value={pushNotification}
              onValueChange={setPushNotification}
              trackColor={{ true: "#e17156", false: "#ccc" }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.value}>Sound effects</Text>
            <Switch
              value={soundEffects}
              onValueChange={setSoundEffects}
              trackColor={{ true: "#e17156", false: "#ccc" }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </View>

      {/* Appearance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.cardRow}>
          <Text style={styles.value}>Theme</Text>
          <MaterialCommunityIcons name="palette" size={24} color="#e17156" />
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          {[
            "Privacy Policy",
            "Terms of Services",
            "Open Source Licenses",
            "Help Center",
          ].map((item, index) => (
            <View style={styles.rowBetween} key={index}>
              <Text style={styles.value}>{item}</Text>
              <Ionicons name="chevron-forward" size={18} color="black" />
            </View>
          ))}
        </View>
      </View>

      {/* Logout & Delete */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>LOGOUT</Text>
        <Ionicons
          name="log-out-outline"
          size={20}
          color="white"
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
        <Text style={styles.deleteText}>Delete account</Text>
      </TouchableOpacity>

      {/* Change Password Modal */}
      <Modal visible={showPasswordModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                secureTextEntry={!showCurrentPassword}
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Ionicons
                  name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Ionicons
                  name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setShowPasswordModal(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleChangePassword}
                style={styles.saveButton}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Setting;
