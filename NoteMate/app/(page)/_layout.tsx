import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const PageLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name ="detail" options={{ title: "detail" }} />
    </Stack>
  )
}

export default PageLayout