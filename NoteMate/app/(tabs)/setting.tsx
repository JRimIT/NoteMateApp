import React, { useState, useEffect } from "react";
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
import { API_URL } from "../../constants/api";
import LogoutButton from "../../components/LogoutButton";
import { useAuthStore } from "../../store/authStore";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import ThemePicker from "../../components/ThemePicker";
import createSettingStyles from "../../assets/styles/setting.styles";

const Setting = ({ navigation }: any) => {
  const { logout, token } = useAuthStore();
  const [offlineMode, setOfflineMode] = useState(true);
  const [pushNotification, setPushNotification] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [editingField, setEditingField] = useState<null | "username" | "email">(
    null
  );
  const [originalUsername, setOriginalUsername] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const { colors, theme, setTheme } = useTheme();
  const styles = createSettingStyles(colors);
  const [isThemeModalVisible, setThemeModalVisible] = useState(false);

  const handleThemeChange = (
    newTheme: "forest" | "retro" | "ocean" | "blossom"
  ) => {
    setTheme(newTheme);
    setThemeModalVisible(false);
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(`${API_URL}/profile/delete`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              if (!res.ok) throw new Error("Failed to delete account");
              logout();
              router.replace("/login");
            } catch (error) {
              Alert.alert(
                "Error",
                error instanceof Error ? error.message : "Something went wrong"
              );
            }
          },
        },
      ]
    );
  };

  const handleSaveField = async (field: "username" | "email") => {
    try {
      const updatedData = field === "username" ? { username } : { email };

      const response = await fetch(`${API_URL}/profile/updateInfo`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setEditingField(null);
      Alert.alert("Success", `${field} updated successfully.`);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to update profile"
      );
    }
  };

  const handleCancelEdit = (field: "username" | "email") => {
    if (field === "username") {
      setUsername(originalUsername);
    } else if (field === "email") {
      setEmail(originalEmail);
    }
    setEditingField(null);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirmation do not match.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/profile/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password change failed");
      }

      Alert.alert("Success", "Password changed successfully.");
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Password change failed"
      );
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user info");
      }

      // Gán thông tin user vào các state
      const { username, email, password, profileImage } = data.user;

      setUsername(username || "");
      setEmail(email || "");
      setOriginalUsername(username || "");
      setOriginalEmail(email || "");
      setConfirmPassword(password || "");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to load profile"
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/profile")}
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
            {editingField === "username" ? (
              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity onPress={() => handleSaveField("username")}>
                  <Feather name="check" size={18} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCancelEdit("username")}>
                  <Feather name="x" size={18} color="black" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setEditingField("username")}>
                <Feather name="edit-2" size={18} color="black" />
              </TouchableOpacity>
            )}
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
            {editingField === "email" ? (
              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity onPress={() => handleSaveField("email")}>
                  <Feather name="check" size={18} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCancelEdit("email")}>
                  <Feather name="x" size={18} color="black" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setEditingField("email")}>
                <Feather name="edit-2" size={18} color="black" />
              </TouchableOpacity>
            )}
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
            trackColor={{ true: colors.primary, false: colors.placeholderText }}
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
              trackColor={{
                true: colors.primary,
                false: colors.placeholderText,
              }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.value}>Sound effects</Text>
            <Switch
              value={soundEffects}
              onValueChange={setSoundEffects}
              trackColor={{
                true: colors.primary,
                false: colors.placeholderText,
              }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </View>

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Appearance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Appearance
          </Text>
          <TouchableOpacity
            style={styles.cardRow}
            onPress={() => setThemeModalVisible(true)}
          >
            <Text style={[styles.value, { color: colors.textSecondary }]}>
              Theme
            </Text>
            <MaterialCommunityIcons
              name="palette"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Modal chọn theme */}
        <ThemePicker
          visible={isThemeModalVisible}
          onClose={() => setThemeModalVisible(false)}
          selectedTheme={theme}
          onSelectTheme={handleThemeChange as (theme: string) => void}
        />
      </View>

      {/* Logout & Delete */}

      <LogoutButton />

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
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.primary}
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
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.primary}
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
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.primary}
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
