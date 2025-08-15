import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Linking } from 'react-native'
import { useTranslation } from 'react-i18next'
import { RootStackScreenProps } from './types'
import { colors, typeScale } from '../utils'

export default function HelpScreen({ navigation }: RootStackScreenProps<'Help'>) {
  const { t } = useTranslation()

  const helpOptions = [
    { id: 'faq', title: 'Frequently Asked Questions', onPress: () => Linking.openURL('https://ckash.app/#faqs') },
    { id: 'forum', title: 'Forum', onPress: () => {} },
    { id: 'contact', title: 'Contact', onPress: () => {} },
    { id: 'community', title: 'Community', onPress: () => navigation.navigate('Community') },
  ]

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          testID="HelpBackButton"
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {helpOptions.map((option, index) => (
          <View key={option.id}>
            <TouchableOpacity
              style={styles.optionContainer}
              onPress={option.onPress}
              testID={`HelpOption_${option.id}`}
            >
              <Text style={styles.optionText}>{option.title}</Text>
              <Text style={styles.arrowText}>↗</Text>
            </TouchableOpacity>
            {index < helpOptions.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: colors.contentPrimary,
    fontFamily: 'Inter-Regular',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    lineHeight: 24,
    color: colors.contentPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  optionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: colors.contentPrimary,
  },
  arrowText: {
    fontSize: 16,
    color: colors.contentSecondary,
    fontFamily: 'Inter-Regular',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 8,
    marginRight: 8,
  },
}) 