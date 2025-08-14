import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Linking } from 'react-native'
import { useTranslation } from 'react-i18next'
import { RootStackScreenProps } from '../types'
import { colors, typeScale } from '../../utils'
import XIcon from '../../assets/icons/x-icon.svg'
import TelegramIcon from '../../assets/icons/telegram-icon.svg'
import LinkedInIcon from '../../assets/icons/linkedIn-icon.svg'

export default function CommunityScreen({ navigation }: RootStackScreenProps<'Community'>) {
  const { t } = useTranslation()

  const socialLinks = [
    {
      id: 'twitter',
      label: 'X (formerly twitter)',
      icon: 'X',
      link: 'www.x.com/cKashApp',
      onPress: () => Linking.openURL('https://www.x.com/cKashApp')
    },
    {
      id: 'telegram',
      label: 'Telegram',
      icon: 'Telegram',
      link: 'www.t.me/cKashapp',
      onPress: () => Linking.openURL('https://www.t.me/cKashapp')
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: 'LinkedIn',
      link: 'linked.com/cKash-app',
      onPress: () => Linking.openURL('https://www.linkedin.com/company/ckash-app')
    }
  ]

  return (
    <View style={styles.container}>
      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {socialLinks.map((social, index) => (
            <View key={social.id}>
                  <View style={styles.socialItem}>
                <Text style={styles.socialLabel}>{social.label}</Text>
                <TouchableOpacity 
                  style={styles.linkContainer}
                  onPress={social.onPress}
                  testID={`CommunityLink_${social.id}`}
                >
                    <View style={styles.iconContainer}>
                  {social.icon === 'X' && <XIcon width={24} height={24} color="#1B1A46" />}
                  {social.icon === 'Telegram' && <TelegramIcon width={25} height={25} color="#1B1A46" />}
                  {social.icon === 'LinkedIn' && <LinkedInIcon width={24} height={24} color="#1B1A46" />}
                </View>
                  <Text style={styles.linkText}>{social.link}</Text>
                </TouchableOpacity>
              </View>
              {index < socialLinks.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>
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
  card: {
    backgroundColor: '#E8F0FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  socialItem: {
    paddingVertical: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#B7C8F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  socialLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    lineHeight: 24,
    color: colors.contentPrimary,
    marginBottom: 8,
  },
  linkContainer: {
    backgroundColor: '#D7E1FF',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.contentSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
}) 