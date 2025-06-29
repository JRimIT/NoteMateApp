import { View, Text, StyleSheet } from 'react-native'
import React, { use } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import  COLOR  from '../constants/colors';

const SafeScreen = ({children} : any) => {
  const insets = useSafeAreaInsets();
  
    return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
     backgroundColor: COLOR.background
  }
});

export default SafeScreen