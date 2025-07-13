// NoteMate/app/(page)/edit.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Image, Alert, ScrollView, Text, TouchableOpacity } from 'react-native';
import { API_URL } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
const EditBookScreen = () => {
  const { id } = useLocalSearchParams();
  const [book, setBook] = useState(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');
  const [rating, setRating] = useState(1);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    // Fetch book detail
    fetch(`${API_URL}/books/detail/${id}`)
      .then(res => res.json())
      .then(data => {
        setBook(data.book);
        setTitle(data.book.title);
        setCaption(data.book.caption);
        setImage(data.book.image);
        setRating(data.book.rating);
        setContent(data.book.content || '');
        setTags(data.book.tags ? data.book.tags.join(',') : '');
      });
  }, [id]);

  const handleUpdate = async () => {
    const res = await fetch(`${API_URL}/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        title, caption, image, rating, content, tags: tags.split(',').map(t => t.trim())
      }),
    });
    const data = await res.json();
    if (res.ok) {
      Alert.alert('Thành công', 'Đã cập nhật sách!');
      router.back();
    } else {
      Alert.alert('Lỗi', data.message || 'Cập nhật thất bại');
    }
  };

  if (!book) return null;

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f8f8', padding: 16 }}>
      <View style={{ width: '100%', maxWidth: 420, backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 18, textAlign: 'center', color: '#333' }}>Chỉnh sửa Book</Text>
        <Text style={{ marginBottom: 6, color: '#555' }}>Tiêu đề</Text>
        <TextInput value={title} onChangeText={setTitle} placeholder="Tiêu đề" style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 14, fontSize: 16, backgroundColor: '#fafafa' }} />
        <Text style={{ marginBottom: 6, color: '#555' }}>Mô tả</Text>
        <TextInput value={caption} onChangeText={setCaption} placeholder="Mô tả" style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 14, fontSize: 16, backgroundColor: '#fafafa' }} />
        <Text style={{ marginBottom: 6, color: '#555' }}>Link ảnh</Text>
        <TextInput value={image} onChangeText={setImage} placeholder="Link ảnh" style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 14, fontSize: 16, backgroundColor: '#fafafa' }} />
        {image ? <Image source={{ uri: image }} style={{ width: '100%', height: 180, borderRadius: 10, marginBottom: 14, resizeMode: 'cover' }} /> : null}
        <Text style={{ marginBottom: 6, color: '#555' }}>Đánh giá (1-5)</Text>
        <TextInput value={rating.toString()} onChangeText={t => setRating(Number(t))} placeholder="Đánh giá (1-5)" keyboardType="numeric" style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 14, fontSize: 16, backgroundColor: '#fafafa' }} />
        <Text style={{ marginBottom: 6, color: '#555' }}>Nội dung</Text>
        <TextInput value={content} onChangeText={setContent} placeholder="Nội dung" multiline style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, minHeight: 80, marginBottom: 14, fontSize: 16, backgroundColor: '#fafafa', textAlignVertical: 'top' }} />
        <Text style={{ marginBottom: 6, color: '#555' }}>Tags (cách nhau bởi dấu phẩy)</Text>
        <TextInput value={tags} onChangeText={setTags} placeholder="Tags (cách nhau bởi dấu phẩy)" style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 22, fontSize: 16, backgroundColor: '#fafafa' }} />
        <TouchableOpacity onPress={handleUpdate} style={{ backgroundColor: '#1976d2', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 8 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 17, letterSpacing: 1 }}>CẬP NHẬT</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditBookScreen;