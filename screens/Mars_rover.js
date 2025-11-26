import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Mars_rover = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Mars</Text>
    </SafeAreaView>
  )
}

export default Mars_rover

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    width: "100%",
    height: "100%"
  }
})