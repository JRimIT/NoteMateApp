import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import COLORS from '../constants/colors'


const Loader = () => {
  return (
    <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
       
      </View>
  )
}

export default Loader