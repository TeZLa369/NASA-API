import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Favs = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Favs</Text>
    </SafeAreaView>
  )
}

export default Favs

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    width: "100%",
    height: "100%"
  }
})