import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import Loader from "../../components/Loader";
import { API_URL } from "../../constants/api";
import { useAuthStore } from "../../store/authStore";
import { useFocusEffect } from "@react-navigation/native";
import { debounce } from "lodash";
import createDetailStyles from "../../assets/styles/detail.styles";
import { AntDesign } from '@expo/vector-icons';

const Detail = () => {
  const { colors, theme, setTheme } = useTheme();
  // const styles = createHomeStyles(colors);
  const styles = createDetailStyles(colors);
  const { id } = useLocalSearchParams();
  const { token } = useAuthStore();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [contentBook, setContentBook] = useState("");

  useEffect(() => {
    fetchDataBook();
  }, []);

  useEffect(() => {
    if (note !== "") {
      autoSaveNote(note);
    }
  }, [note]);

  const pickImage = async () => {
    if (Platform.OS === "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const formData = new FormData();
      formData.append("image", {
        uri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);

      try {
        setLoading(true);
        const response = await axios.post(
          "http://10.0.2.2:3000/api/AI/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        const { summary } = response.data;
        setNote((prev) => prev + "\n" + summary);
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload failed");
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchDataBook = async () => {
    try {
      const response = await axios.get(`${API_URL}/books/detail/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Data Book: ", response.data.book.content);
      setContentBook(response.data.book.content);
      setNote(response.data.book.content);
    } catch (error) {
      console.error("Error fetching book detail:", error);
    }
  };

  const autoSaveNote = debounce(async (content: string) => {
    try {
      await axios.post(`${API_URL}/books/detail`, {
        bookId: id,
        content,
      });
      console.log("Auto saved");
    } catch (error) {
      console.error("Error auto saving note:", error);
    }
  }, 1000); // Đợi 1 giây sau lần nhập cuối cùng mới gọi API

  const handleBack = () => {};

  useFocusEffect(
    React.useCallback(() => {
      fetchDataBook();
    }, [id])
  );

  if (loading) {
    return <Loader></Loader>;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.buttonSubmit}
              onPress={() => router.back()}
            >
              <Text style={styles.headerTitle}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Book Note</Text>
          </View>

          <View style={styles.bookCard}>
            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <TextInput
                style={styles.input}
                multiline
                placeholder="Enter your text here..."
                textAlignVertical="top"
                value={note}
                onChangeText={setNote}
              />
            )}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.AIbutton} onPress={pickImage}>
              <Image
                source={require("../../assets/images/i.png")}
                style={{ width: 30, height: 30, resizeMode: "contain" }}
              />
              <Text style={{ marginTop: 5 }}>NOTE AI</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Remove the Floating Action Button (FAB) for Edit */}
    </KeyboardAvoidingView>
  );
};

// const style = StyleSheet.create({//HERE
//     flex: 1,
//     backgroundColor: colors.placeholderText,
//     padding: 16,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     textAlignVertical: "top",
//     minHeight: 300,
//   },
//   AIbutton: {
//     backgroundColor: colors.primary,
//     display: "flex",
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     width: 120,
//     padding: 10,
//     borderRadius: 10,
//   },
//   bookCard: {
//     flex: 100,
//     backgroundColor: colors.cardBackground,
//     borderRadius: 16,
//     marginBottom: 20,
//     padding: 10,
//     shadowColor: colors.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: colors.border,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   footer: {
//     flex: 1,
//     backgroundColor: colors.inputBackground,
//     borderRadius: 16,
//     marginBottom: 20,
//     padding: 16,
//     shadowColor: colors.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: colors.border,
//   },
//   header: {
//     marginBottom: 10,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 10,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontFamily: "JetBrainsMono-Medium",
//     letterSpacing: 0.5,
//     color: colors.white,
//     marginBottom: 8,
//   },
//   buttonSubmit: {
//     backgroundColor: "#FF7A20",
//     justifyContent: "center",
//     alignItems: "center",
//     height: 35,
//     paddingHorizontal: 10,
//     borderRadius: 10,
//   },
// });

export default Detail;
