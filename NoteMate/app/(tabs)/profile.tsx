import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../constants/api";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/profile.styles";
import Loader from "../../components/Loader";
import LogoutButton from "../../components/LogoutButton";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Profile = () => {
  const { logout, token } = useAuthStore();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);

  const [editVisible, setEditVisible] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAvatar, setNewAvatar] = useState("");

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    latestTitle: "",
  });

  const router = useRouter();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchUserInfo(), fetchUserBooks()]);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to fetch user info");

      setUserInfo(data.user);
      setNewUsername(data.user.username);
      setNewEmail(data.user.email);
      setNewAvatar(data.user.profileImage || "");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to load profile"
      );
    }
  };

  const fetchUserBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/books/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to fetch books");

      setBooks(data.books);
      calculateStats(data.books); // ⬅️ Thêm dòng này để tính thống kê
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to load books"
      );
    }
  };

  const calculateStats = (books: any[]) => {
    const total = books.length;

    const averageRating =
      total > 0
        ? books.reduce((sum: number, b: any) => sum + (b.rating || 0), 0) /
          total
        : 0;

    const latestBook = books.reduce(
      (latest: any, b: any) =>
        new Date(b.createdAt) > new Date(latest.createdAt) ? b : latest,
      books[0] || { title: "" }
    );

    setStats({
      total,
      averageRating: Number(averageRating.toFixed(1)),
      latestTitle: latestBook?.title || "",
    });
  };

  const renderRatingStars = (rating: number) => (
    <View style={styles.ratingContainer}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Ionicons
          key={i}
          name={i < rating ? "star" : "star-outline"}
          size={22}
          color={i < rating ? "#f4b400" : COLORS.textSecondary}
        />
      ))}
    </View>
  );

  const handleDeleteBook = async (bookId: string) => {
    try {
      setDeleteBookId(bookId);
      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to delete book");

      const updatedBooks = books.filter((book) => book._id !== bookId);
      setBooks(updatedBooks);
      calculateStats(updatedBooks);
      Alert.alert("Success", "Book deleted successfully");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Delete failed"
      );
    } finally {
      setDeleteBookId(null);
    }
  };

  const confirmDelete = (bookId: string) => {
    Alert.alert("Delete Book", "Are you sure you want to delete this book?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => handleDeleteBook(bookId),
        style: "destructive",
      },
    ]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await sleep(800);
    await fetchAllData();
    setRefreshing(false);
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/profile/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: newUsername,
          email: newEmail,
          profileImage: newAvatar,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update failed");

      setUserInfo(data.user);
      setEditVisible(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Update failed"
      );
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await fetch(`${API_URL}/profile/change-password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: oldPassword,
          newPassword,
        }),
      });

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error("Unexpected server response (not JSON):\n" + text);
      }

      if (!response.ok) {
        throw new Error(data.message || "Change password failed");
      }

      Alert.alert("Success", "Password changed successfully");
      setPasswordModalVisible(false);
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Change failed"
      );
    }
  };

  const renderBookItem = ({ item }: { item: any }) => (
    <View style={styles.bookItem}>
      <Image source={{ uri: item.image }} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        {renderRatingStars(item.rating)}
        <Text style={styles.bookCaption} numberOfLines={2}>
          {item.caption}
        </Text>
        <Text style={styles.bookDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(item._id)}
      >
        {deleteBookId === item._id ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <Ionicons name="trash-outline" size={24} color={COLORS.primary} />
        )}
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) return <Loader />;

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        {userInfo?.profileImage ? (
          <Image
            source={{ uri: userInfo.profileImage }}
            style={styles.avatar}
          />
        ) : (
          <Ionicons
            name="person-circle-outline"
            size={70}
            color={COLORS.primary}
          />
        )}
        <View>
          <Text style={styles.username}>{userInfo?.username}</Text>
          <Text style={styles.email}>{userInfo?.email}</Text>

          {/* Thống kê */}
          <View style={{ marginTop: 8 }}>
            <Text style={styles.statsText}>📚 Total: {stats.total}</Text>
            <Text style={styles.statsText}>⭐ Avg: {stats.averageRating}</Text>
            <Text style={styles.statsText}>🆕 Newest: {stats.latestTitle}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setEditVisible(true)}
          style={{ marginLeft: 10, bottom: 20 }}
        >
          <Ionicons name="create-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setPasswordModalVisible(true)}
          style={{ marginLeft: 10, bottom: 20 }}
        >
          <Ionicons
            name="lock-closed-outline"
            size={22}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      <LogoutButton />

      <View style={styles.booksHeader}>
        <Text style={styles.bookTitle}>Your Recommendations</Text>
        <Text style={styles.booksCount}>{books?.length} books</Text>
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => item._id}
        renderItem={renderBookItem}
        contentContainerStyle={styles.booksList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={50}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No books found</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Ionicons name="add" size={24} color={COLORS.white} />
              <Text style={styles.addButtonText}>Add Book</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Modal chỉnh sửa thông tin */}
      <Modal visible={editVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={newUsername}
              onChangeText={setNewUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={newEmail}
              onChangeText={setNewEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Profile Image URL"
              value={newAvatar}
              onChangeText={setNewAvatar}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setEditVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleUpdateProfile}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal đổi mật khẩu */}
      <Modal
        visible={passwordModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setPasswordModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleChangePassword}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Profile;
