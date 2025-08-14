import * as React from 'react'
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native'
import { navigate } from '@divvi/mobile'

interface HelpButtonProps {
  style?: any
}

export default function HelpButton({ style }: HelpButtonProps) {
  const handlePress = () => {
    navigate('ContactForm')
  }

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={styles.questionMark}>?</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#1B5BFF',
  },
  questionMark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Heebo-Bold',
  },
}) 