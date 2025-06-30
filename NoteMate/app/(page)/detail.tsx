import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import styles from '../../assets/styles/home.styles';
import COLORS from '../../constants/colors';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import Loader from '../../components/Loader';

const Detail = () => {
  const { id } = useLocalSearchParams();
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
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
      formData.append('image', {
        uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      try {
        setLoading(true);
        const response = await axios.post('http://10.0.2.2:3000/api/AI/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const { summary } = response.data;
        setNote(summary);
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Upload failed');
      } finally {
        setLoading(false);
      }
    }
  };

  
  if (loading) {
    return (
      <Loader></Loader>
    )
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={style.header}>
            <Text style={styles.headerTitle}>Book Note</Text>
            <TouchableOpacity style={style.buttonSubmit}>
              <Text style={{ color: 'white' }}>Finished</Text>
            </TouchableOpacity>
          </View>

          <View style={style.bookCard}>
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
              <TextInput
                style={style.input}
                multiline
                placeholder="Enter your text here..."
                textAlignVertical="top"
                value={note}
                onChangeText={setNote}
              />
            )}
          </View>

          <View style={style.footer}>
            <TouchableOpacity style={style.AIbutton} onPress={pickImage}>
              <Image source={require('../../assets/images/i.png')} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
              <Text style={{ marginTop: 5 }}>NOTE AI</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 300,
  },
  AIbutton: {
    backgroundColor: '#F9A065',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    padding: 10,
    borderRadius: 10,
  },
  bookCard: {
    flex: 100,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    marginBottom: 20,
    padding: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 1,
    backgroundColor: '#FFCEAE',
    borderRadius: 16,
    marginBottom: 20,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  buttonSubmit: {
    backgroundColor: '#FF7A20',
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});

export default Detail;
