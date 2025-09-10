import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors } from '../utils'
import CopyIcon from '../assets/icons/copy-icon.svg'

interface CopyableFieldProps {
  label: string
  value: string
  onCopy: () => void
}

export default function CopyableField({ label, value, onCopy }: CopyableFieldProps) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputRight}>
        <Text style={styles.inputValue}>{value}</Text>
        <TouchableOpacity onPress={onCopy} style={styles.copyButton}>
          <CopyIcon width={16} height={16} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputLabel: {
    fontSize: 12,
    color: colors.contentSecondary,
    flex: 1,
  },
  inputRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputValue: {
    fontSize: 12,
    color: colors.contentPrimary,
    fontWeight: '500',
    marginRight: 8,
  },
  copyButton: {
    padding: 4,
  },
})
