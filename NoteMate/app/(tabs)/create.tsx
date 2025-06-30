import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'

import { Ionicons } from '@expo/vector-icons'


import * as ImagePicker from 'expo-image-picker'

import * as FileSystem from 'expo-file-system'
import { useAuthStore } from '../../store/authStore'
import styles from '../../assets/styles/create.styles'
import COLORS from '../../constants/colors'




const Create = () => {
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [image, setImage] = useState("")
  const [rating, setRating] = useState(3)
  const [imageBase64, setImageBase64] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const {token} = useAuthStore()


  const pickImage = async () => {
   try {
    if (Platform.OS === 'web') {
      const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!')
        return
      }
    } 

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    })

    if (!result.canceled) {
      const selectedImage = result.assets[0]
      console.log('Selected image:', result);
      
      setImage(result.assets[0].uri)
      // setImageBase64(selectedImage.base64)
      if(result.assets[0].base64) {
        setImageBase64(result.assets[0].base64)
      }else{
        //otherwise, convert the image to base64
        const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
          encoding: "base64",
        })
        setImageBase64(base64)
      }

    } else {
      console.log('Image selection was canceled')
    }
   
  }catch (error) {
    console.error('Error requesting media library permissions:', error)
    Alert.alert(
      'Error',
      'There was an error accessing the media library. Please try again later.'
    )
   }
}

  const handleSubmit = async () => {
    if (!title || !caption || !imageBase64 || !rating) {
      Alert.alert('Error', 'Please fill in all fields and select an image.')
      return
    }

    try {
      setIsLoading(true)
      // const token = await AsyncStorage.getItem('token')
      const uriParts = image.split('.')
      const fileType = uriParts[uriParts.length - 1]
      const imageType = fileType ? `image/${fileType.toLowerCase()}` : 'image/jpeg'

      const imageDataUrl = `data:${imageType};base64,${imageBase64}`
      // const imageDataUrl = imageBase64;
      
      const response = await fetch(`http://10.0.2.2:3000/api/books`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          caption,
          image: imageDataUrl,
          rating: rating.toString(),
        }),
      })

     
   
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }
      Alert.alert('Success', 'Book recommendation added successfully!')
      setTitle('')
      setCaption('')

      setImage('')
      setImageBase64('')
      setRating(3)
      router.push('/')

    } catch (error) {
      console.log('Error submitting book recommendation:', error);
      const errorMessage = (error instanceof Error && error.message) ? error.message : 'Something went wrong. Please try again.'
      Alert.alert('Error', errorMessage)
      
    }finally {
      setIsLoading(false)
    }

  }

  const renderRatingPicker = (rating : any) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>

          <Ionicons 
            key={i}
            name={i <= rating ? "star" : "star-outline"}
            size={32}
            color={i <= rating ? "#f4b400" : COLORS.textSecondary}
            
            />
        </TouchableOpacity>
      )
    }
    return <View style={styles.ratingContainer}>{stars}</View>
  }

  // const handleLogout = async() => {
  //   // Handle logout logic here
  //   await AsyncStorage.removeItem('token')
  //   await AsyncStorage.removeItem('user')
  //   router.push('/(auth)')
  // }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1}}
      behavior= {Platform.OS === 'ios' ? 'padding' : 'height'}

 > 
      {/* <TouchableOpacity 
        style={styles.button}
        onPress={handleLogout}
      ><View>Logout</View></TouchableOpacity>  */}
      <ScrollView 
        contentContainerStyle= {styles.container}
        style={styles.scrollViewStyle}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style= {styles.title}>Add Book Recommendation</Text>
            <Text style= {styles.subtitle}>Share your favorite reads with others</Text>
          </View>

          <View style={styles.form}>
            {/* Book title */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons 
                  name="book-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                ></Ionicons>

                <TextInput
                  style={styles.input}
                  placeholder="Enter book title"
                  placeholderTextColor={COLORS.placeholderText}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>
            {/* Rating */}
            <View style={styles.ratingContainer}>
              <Text style={styles.label}>Rating</Text>
              <View style={styles.inputContainer}>
                {renderRatingPicker(rating)}
              </View>
            </View>

            {/* IMAGE */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Cover Image</Text>
              <TouchableOpacity 
                style={styles.imagePicker}
                onPress={pickImage}
              >
                { image ? (
                  <Image
                    source={{ uri: image }}
                    style={styles.previewImage}
                  />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons 
                      name="image-outline"
                      size={50}
                      color={COLORS.textSecondary}
                    />
                    <Text style={styles.placeholderText}>No image selected</Text>
                  </View>
                  
                )}
              
                <Text style={styles.imagePicker}>Pick an image</Text>
              </TouchableOpacity>
            </View>

            {/* Caption */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Caption</Text>
           

                <TextInput
                  style={styles.textArea}
                  placeholder="Enter a caption"
                  placeholderTextColor={COLORS.placeholderText}
                  value={caption}
                  onChangeText={setCaption}
                  multiline
                  
                />
              
            </View> 

            <TouchableOpacity 
              style={styles.button}
              onPress={handleSubmit}
              disabled={isLoading}
            >
             { isLoading ? (
              <ActivityIndicator 
                size="small" 
                color={COLORS.white}
              />
              ) : (
              <>
                <Ionicons 
                  name="cloud-upload-outline"
                  size={20}
                  color={COLORS.white}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Share</Text>
              </>
              )
            }
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Create