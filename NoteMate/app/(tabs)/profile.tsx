import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../constants/api";
import Loader from "../../components/Loader";
import LogoutButton from "../../components/LogoutButton";
import { useTheme } from "../../contexts/ThemeContext";
import createProfileStyles from "../../assets/styles/profile.styles";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Profile = () => {
  const { logout, token } = useAuthStore();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);
  const [newAvatar, setNewAvatar] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    latestTitle: "",
  });
  const { colors, theme, setTheme } = useTheme();
  const styles = createProfileStyles(colors);

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
      calculateStats(data.books);
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
          color={i < rating ? "#f4b400" : colors.textSecondary}
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

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setNewAvatar(base64Image);
      setLoading(true);

      try {
        const response = await fetch(`${API_URL}/profile/avatar`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ profileImage: base64Image }),
        });

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to update avatar");

        Alert.alert("Success", "Avatar updated successfully");
        fetchUserInfo(); // Refresh info from server
      } catch (error) {
        Alert.alert(
          "Error",
          error instanceof Error ? error.message : "Failed to update avatar"
        );
      } finally {
        setLoading(false);
      }
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
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => confirmDelete(item._id)}
        >
          {deleteBookId === item._id ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Ionicons name="trash-outline" size={24} color={colors.primary} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteButton, { marginLeft: 8 }]}
          onPress={() => router.push({ pathname: 'edit', params: { id: item._id } })}
        >
          <Ionicons name="pencil-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && !refreshing) return <Loader />;

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        {/* Avatar and buttons in a vertical column */}
        <View style={{ alignItems: 'center', marginRight: 16 }}>
          {newAvatar ? (
            <Image source={{ uri: newAvatar }} style={styles.avatar} />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={70}
              color={colors.primary}
            />
          )}
          {/* Two buttons in a horizontal row below avatar */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8, gap: 12 }}>
            <TouchableOpacity onPress={handlePickAvatar}>
              <Ionicons name="image-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/setting") }>
              <Ionicons name="settings-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
        {/* User info in a separate column */}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={styles.username}>{userInfo?.username}</Text>
          <Text style={styles.email}>{userInfo?.email}</Text>
          <View style={{ marginTop: 8 }}>
            <Text style={styles.statsText}>📚 Total: {stats.total}</Text>
            <Text style={styles.statsText}>⭐ Avg: {stats.averageRating}</Text>
            <Text style={styles.statsText}>🆕 Newest: {stats.latestTitle}</Text>
          </View>
        </View>
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
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={50}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>No books found</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Ionicons name="add" size={24} color={colors.white} />
              <Text style={styles.addButtonText}>Add Book</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

export default Profile;
