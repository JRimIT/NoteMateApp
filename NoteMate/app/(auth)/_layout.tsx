import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name ="index" options={{ title: "Login" }} />
    </Stack>
  )
}

export default AuthLayout