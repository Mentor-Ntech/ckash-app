import React from 'react'
import { View, StyleSheet } from 'react-native'

interface QRCodeSectionProps {
  qrCodeComponent: React.ReactNode
}

export default function QRCodeSection({ 
  qrCodeComponent
}: QRCodeSectionProps) {
  return (
    <View style={styles.qrSection}>
      <View style={styles.qrContainer}>
        {qrCodeComponent}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  qrSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  qrContainer: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
})
