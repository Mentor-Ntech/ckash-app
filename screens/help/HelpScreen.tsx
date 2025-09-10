import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Linking } from 'react-native'
import { RootStackScreenProps } from '../types'
import { colors } from '../../utils'

export default function HelpScreen({ navigation }: Readonly<RootStackScreenProps<'Help'>>) {

  const helpOptions = [
    { id: 'faq', title: 'Frequently Asked Questions', onPress: () => Linking.openURL('https://ckash.app/#faqs') },
    { id: 'contact', title: 'Contact', onPress: () => navigation.navigate('ContactForm') },
    { id: 'community', title: 'Community', onPress: () => navigation.navigate('Community') },
    { id: 'refer', title: 'Refer & Earn Rewards', onPress: () => navigation.navigate('ReferEarn') },
  ]

  return (
    <View style={styles.container}>
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

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
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