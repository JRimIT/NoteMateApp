import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator, RefreshControl } from 'react-native'
import React, { use, useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../../store/authStore'
import { API_URL } from '../../constants/api'
import styles from '../../assets/styles/home.styles'
import { formatPublishDate } from '../../lib/utils'
import COLORS from '../../constants/colors'
import Loader from '../../components/Loader'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const Home = () => {
  const {logout, token} = useAuthStore()
  const [books, setBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  
  useEffect(() => {
    fetchBooks()
  }, [])


  // const fetchBooks = async(pageNumber = 1, refresh = false) => {
  //   try {
  //     if (refresh) {
  //       setRefreshing(true)
        
  //     }else if (pageNumber === 1) {
  //       setLoading(true)
  //     }

  //     const response = await fetch(`${API_URL}/books?page=${pageNumber}&limit=2`, {

  //       method: 'GET',
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
      
  //     })

  //     const data = await response.json()

  //     if (!response.ok) {
  //       throw new Error(data.message || 'Failed to fetch books')
  //     }

  //     // setBooks(prevBooks => [...prevBooks, ...data.books])
  //     const uniqueBooks = refresh || pageNumber === 1 
  //     ? data.books
  //     : Array.from(new Set([...books, ...data.books.map((book: any) => book._id)])).map((id: any)=> [...books, ...data.books].find((book: any) => book._id === id))

  //     setBooks(uniqueBooks)

  //     setHasMore(pageNumber < data.totalPages)
  //     setPage(pageNumber)
  //   } catch (error) {
  //     console.error('Error fetching books:', error)
  //     if (error instanceof Error) {
  //       alert(error.message)
  //     } else {
  //       alert('An unexpected error occurred')
  //     } 

  //   }finally {
  //     if (refresh) {
  //       setRefreshing(false)
  //     } else {
  //       setLoading(false)
  //     }
  //   }

  // }

  const fetchBooks = async (pageNumber = 1, refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true)
      } else if (pageNumber === 1) {
        setLoading(true)
      }
  
      const response = await fetch(`${API_URL}/books?page=${pageNumber}&limit=2`, {
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
  
      if (refresh || pageNumber === 1) {
        setBooks(data.books)
      } else {
        // Chỉ nối thêm
        setBooks(prevBooks => [...prevBooks, ...data.books])
      }
  
      setHasMore(pageNumber < data.totalPages)
      setPage(pageNumber)
    } catch (error) {
      console.error('Error fetching books:', error)
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('An unexpected error occurred')
      }
    } finally {
      if (refresh) {
        await sleep(800) // Giả lập độ trễ
        setRefreshing(false)
      } else {
        setLoading(false)
      }
    }
  }
  
  const renderItem = ({item} : any) => {
    return (
     
      <View style={styles.bookCard}>
       

        <View style={styles.bookHeader}>

        
          <View style={styles.userInfo}>
            <Image source={{uri: item.user.profileImage}} style = {styles.avatar}/>
            <Text style={styles.username}>{item.user.username}</Text>
          </View>
        </View>

        <View style={styles.bookImageContainer}>
          <Image source={{uri: item.image}} style={styles.bookImage} />
        </View>

        <View style={styles.bookDetails}>
          <Text style= {styles.bookTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            {renderRatingStars(item.rating)}
          </View>
          <Text style={styles.caption}>{item.caption}</Text>
          <Text style = {styles.date}>Shared on {formatPublishDate(item.createdAt)}</Text>
        
        </View>


      </View>
    )
  }

  const renderRatingStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{marginRight: 2}}
        />
      )
    }
    return <View style={styles.ratingContainer}>{stars}</View>
  }

  const handleLoadMore = async() => {
    if( hasMore && !loading && !refreshing) {
      await sleep(1000) // Giả lập độ trễ
      await fetchBooks(page + 1)
    }
  }

  if (loading) {
    return (
      <Loader></Loader>
    )
  }


  return (
    <View style= {styles.container}>
      {/* <View style={styles.header}>
        <Text >Book Recommendations</Text>
        <TouchableOpacity onPress={logout} >
          <Text >Logout</Text>
        </TouchableOpacity>
      </View> */}
      <FlatList
        data={books}
        keyExtractor={(item : any) => item._id}
        renderItem={renderItem}
        contentContainerStyle= {styles.listContainer}
        showsVerticalScrollIndicator={false}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchBooks(1, true)}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          ></RefreshControl>
        }

        onEndReached={handleLoadMore}  
        onEndReachedThreshold={0.5}

        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Book Recommendations</Text>
            <Text style={styles.headerSubtitle}>Discover and share your favorite books</Text>
          </View>
        }
        
        ListFooterComponent={
          hasMore && books.length > 0 ? (
            <ActivityIndicator style={styles.footerLoader} size="large" color={COLORS.primary} />
          ): null
        }

        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No books found</Text>
            <Text style={styles.emptySubtext}>Start sharing your favorite books!</Text>
          </View>
        }
      ></FlatList>
      
    </View>
  )
}


export default Home