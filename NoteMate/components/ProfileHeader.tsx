import { View, Text, Image } from 'react-native'
import React from 'react'
import { useAuthStore } from '../store/authStore'
import styles from '../assets/styles/profile.styles'
import { formatMemberSince } from '../lib/utils'


const ProfileHeader = () => {
    const {user} = useAuthStore()
    if (!user) {
        return null 
    }
    let url = user.profileImage
    let newUrl = url.replace('svg', 'png');
    // console.log("user profile image: ", newUrl);
    
  return (
    <View style={styles.profileHeader}>
      <Image
        source={{ uri: newUrl }}
        style={styles.profileImage}
        />
     

        <View style={styles.profileInfo}>
            <Text style={styles.username}>{user?.username || 'User Name'}</Text>
            <Text style={styles.email}>{user?.email || 'Email Address'}</Text>
            <Text style={styles.memberSince}>Joined {formatMemberSince(user?.createdAt || null)}</Text>
         </View>
    </View>
  )
}

export default ProfileHeader