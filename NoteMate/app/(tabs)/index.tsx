import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TextInput,
} from "react-native";
import React, { use, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";
import { API_URL, BACKEND_URL } from "../../constants/api";
import { useTheme } from "../../contexts/ThemeContext";
import createHomeStyles from "../../assets/styles/home.styles";
import { formatPublishDate } from "../../lib/utils";
import Loader from "../../components/Loader";

import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Home = () => {
  const router = useRouter();
  const { colors, theme, setTheme } = useTheme();
  const styles = createHomeStyles(colors);
  const { logout, token } = useAuthStore();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const TAGS = ["React", "Node", "AI", "Book", "Life"];
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchFavorites();
      fetchBooks(1, true);
    }, [])
  );

  const handleSearch = async () => {
    if (!query.trim() && !selectedTag && !fromDate && !toDate) {
      setResults([]);
      setSearchText("");
      return;
    }
    setSearching(true);
    setSearchText(query);
    let url = `${API_URL}/books/search?q=${encodeURIComponent(query)}`;
    if (selectedTag) url += `&tag=${selectedTag}`;
    if (fromDate) url += `&from=${fromDate.toISOString()}`;
    if (toDate) url += `&to=${toDate.toISOString()}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      setResults([]);
    }
    setSearching(false);
  };

  const fetchBooks = async (pageNumber = 1, refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else if (pageNumber === 1) {
        setLoading(true);
      }

      const response = await fetch(
        `${API_URL}/books?page=${pageNumber}&limit=2`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch books");
      }

      if (refresh || pageNumber === 1) {
        setBooks(data.books);
      } else {
        // Chỉ nối thêm
        setBooks((prevBooks) => [...prevBooks, ...data.books]);
      }

      setHasMore(pageNumber < data.totalPages);
      setPage(pageNumber);
    } catch (error: any) {
      console.error("Error fetching books:", error);

      if (error.message === "jwt expired") {
        logout();
        Alert.alert("ERROR", "Please Login again!");
      } else if (error.message === "jwt malformed") {
        logout();
        Alert.alert("ERROR", "Please Login again!");
      } else {
        alert("An unexpected error occurred");
      }
    } finally {
      if (refresh) {
        await sleep(800); // Giả lập độ trễ
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleDetailPress = (bookId: string) => {
    // router.push(`/(page)/detail?id=${bookId}`)
    router.push({
      pathname: "/(page)/detail",
      params: { id: bookId },
    });
  };
  const fetchFavorites = async () => {
    const response = await fetch(`${API_URL}/auth/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("API trả về favorites:", data);
    setFavorites(data.map((book: any) => book._id));
  };

  const handleToggleFavorite = async (bookId: string) => {
    const isFavorite = favorites.includes(bookId);
    const method = isFavorite ? "DELETE" : "POST";
    console.log("Trước khi gọi API, favorites:", favorites);
    await fetch(`${API_URL}/auth/favorite/${bookId}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    await fetchFavorites();
    console.log("Sau khi fetch lại, favorites:", favorites);
  };

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => handleDetailPress(item._id)}
        activeOpacity={0.8}
      >
        <View style={styles.bookCard}>
          <TouchableOpacity
            onPress={() => handleToggleFavorite(item._id)}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 10,
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 4,
              elevation: 2,
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 4,
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={favorites.includes(item._id) ? "heart" : "heart-outline"}
              size={22}
              color={favorites.includes(item._id) ? "#e53935" : "#888"}
            />
          </TouchableOpacity>
          <View style={styles.bookHeader}>
            <View style={styles.userInfo}>
              <Image
                source={{ uri: item.user.profileImage }}
                style={styles.avatar}
              />
              <Text style={styles.username}>{item.user.username}</Text>
            </View>
          </View>

          <View style={styles.bookImageContainer}>
            <Image source={{ uri: item.image }} style={styles.bookImage} />
          </View>

          <View style={styles.bookDetails}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <View style={styles.ratingContainer}>
              {renderRatingStars(item.rating)}
            </View>
            <Text style={styles.caption}>{item.caption}</Text>
            <Text style={styles.date}>
              Shared on {formatPublishDate(item.createdAt)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#f4b400" : colors.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  const handleLoadMore = async () => {
    if (hasMore && !loading && !refreshing) {
      await sleep(1000); // Giả lập độ trễ
      await fetchBooks(page + 1);
    }
  };

  if (loading && !searching) {
    return <Loader></Loader>;
  }

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
          marginTop: 20,
          justifyContent: "center",
        }}
      >
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#bbb",
            borderRadius: 24,
            paddingVertical: 12,
            paddingHorizontal: 20,
            fontSize: 16,
            backgroundColor: "#fff",
            marginRight: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
          }}
          placeholder="🔍 Tìm kiếm ghi chú/sách..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={{
            backgroundColor: "#ff7043",
            borderRadius: 24,
            paddingVertical: 12,
            paddingHorizontal: 28,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#ff7043",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 2,
          }}
          activeOpacity={0.85}
          onPress={handleSearch}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 16,
              letterSpacing: 1,
            }}
          >
            Tìm
          </Text>
        </TouchableOpacity>
      </View>
      {/* Nếu có searchText thì hiển thị kết quả tìm kiếm */}
      {searchText ? (
        searching ? (
          <ActivityIndicator style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={results as any[]}
            keyExtractor={(item: any) => item._id}
            renderItem={({ item }: { item: any }) => (
              <TouchableOpacity
                onPress={() => handleDetailPress(item._id)}
                style={styles.bookCard}
              >
                <View style={styles.bookHeader}>
                  <View style={styles.userInfo}>
                    <Image
                      source={{ uri: item.user.profileImage }}
                      style={styles.avatar}
                    />
                    <Text style={styles.username}>{item.user.username}</Text>
                  </View>
                </View>
                <View style={styles.bookImageContainer}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.bookImage}
                  />
                </View>
                <View style={styles.bookDetails}>
                  <Text style={styles.bookTitle}>{item.title}</Text>
                  <View style={styles.ratingContainer}>
                    {renderRatingStars(item.rating)}
                  </View>
                  <Text style={styles.caption}>{item.caption}</Text>
                  <Text style={styles.date}>
                    Shared on {formatPublishDate(item.createdAt)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={{ marginTop: 20 }}>Không có kết quả</Text>
            }
          />
        )
      ) : (
        // Nếu không có searchText thì hiển thị danh sách books mặc định
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
            marginTop: 4,
          }}
        >
          <TouchableOpacity
            onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 6,
              paddingHorizontal: 14,
              borderRadius: 20,
              backgroundColor: showFavoritesOnly ? "#ffeaea" : "#f0f0f0",
              borderWidth: 1,
              borderColor: showFavoritesOnly ? "#e53935" : "#ccc",
              marginRight: 8,
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name={showFavoritesOnly ? "heart" : "heart-outline"}
              size={20}
              color={showFavoritesOnly ? "#e53935" : "#888"}
            />
            <Text
              style={{
                marginLeft: 8,
                color: showFavoritesOnly ? "#e53935" : "#333",
                fontWeight: "bold",
              }}
            >
              {showFavoritesOnly ? "Chỉ yêu thích" : "Tất cả sách"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={
          showFavoritesOnly
            ? books.filter((b) => favorites.includes(b._id))
            : books
        }
        keyExtractor={(item: any) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchBooks(1, true)}
            colors={[colors.primary]}
            tintColor={colors.primary}
          ></RefreshControl>
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Book Note</Text>
            <Text style={styles.headerSubtitle}>Note it. Mate it. Done.</Text>
          </View>
        }
        ListFooterComponent={
          hasMore && books.length > 0 ? (
            <ActivityIndicator
              style={styles.footerLoader}
              size="large"
              color={colors.primary}
            />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>No books found</Text>
            <Text style={styles.emptySubtext}>
              Start sharing your favorite books!
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default Home;
