import { View, Text, TouchableOpacity, Alert, FlatList, Image, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'

import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../../store/authStore'
import { API_URL } from '../../constants/api'
import COLORS from '../../constants/colors'
import styles from '../../assets/styles/profile.styles'
import Loader from '../../components/Loader'
import ProfileHeader from '../../components/ProfileHeader'
import LogoutButton from '../../components/LogoutButton'



const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const Profile = () => {
  const {logout, token} = useAuthStore()
  const [books, setBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async() => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/books/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch books')
      }
      
      
      setBooks(data.books)
    } catch (error) {
      console.error('Error fetching books:', error)
      Alert.alert('Error', error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const renderRatingPicker = (rating : any) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        

          <Ionicons 
            key={i}
            name={i <= rating ? "star" : "star-outline"}
            size={32}
            color={i <= rating ? "#f4b400" : COLORS.textSecondary}
            
            />
        
      )
    }
    return <View style={styles.ratingContainer}>{stars}</View>
  }
  
  const handleDeleteBook = async (bookId: string) => {
    try {
      setDeleteBookId(bookId)
      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete book')
      }

      setBooks(books.filter(book => book._id !== bookId))
      Alert.alert('Success', 'Book deleted successfully')
    } catch (error) {
      console.error('Error deleting book:', error)
      Alert.alert('Error', error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setDeleteBookId(null)
    }
  }

  const confirmDelete = (bookId: string) => {
    Alert.alert("Delete Book", "Are you sure you want to delete this book?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Delete",
        onPress: () => handleDeleteBook(bookId),
        style: "destructive"
      }
    ])
  }


  const renderBookItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.bookItem}>
        <Image source={{ uri: item.image }} style={styles.bookImage} />

        <View style={styles.bookInfo}>
          <Text style = {styles.bookTitle}>{item.title}</Text>
          <View style = {styles.ratingContainer}>{renderRatingPicker(item.rating)}</View>
          <Text style = {styles.bookCaption} numberOfLines={2}>{item.caption}</Text>
          <Text style = {styles.bookDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id)}>
          {deleteBookId === item._id ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Ionicons name="trash-outline" size={24} color={COLORS.primary} />
          )}
        </TouchableOpacity>

      </View>
    )
 
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await sleep(800) // Simulate network delay
      await fetchData()
    } catch (error) {
      console.error('Error refreshing data:', error)
      Alert.alert('Error', error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setRefreshing(false)
    }
  }

  if ( loading && !refreshing) {
    return (
     <Loader></Loader>
    )
  }

  return (
      
    <View style={styles.container}>
       <ProfileHeader/>
        <LogoutButton></LogoutButton>

        <View style={styles.booksHeader}>
          <Text style = {styles.bookTitle}>Your Recommendation</Text>
          <Text style = {styles.booksCount}>{books?.length} books</Text>
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
              <Ionicons name="book-outline" size={50} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>No books found</Text>
              <TouchableOpacity style={styles.addButton} onPress={() => router.push('/create')}>
                <Ionicons name="add" size={24} color={COLORS.white} />
                <Text style={styles.addButtonText}>Add Book</Text>
              </TouchableOpacity>
            </View>

          }

        ></FlatList>

     </View>
  )
}

export default Profile
