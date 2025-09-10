import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Share,
  Alert,
} from 'react-native'
import { RootStackScreenProps } from '../types'
import { colors } from '../../utils'
import Clipboard from '@react-native-clipboard/clipboard'
import QrCodeIcon from '../../assets/icons/qr-code-icon.svg'
import CopyableField from '../../components/CopyableField'
import SocialShareButtons from '../../components/SocialShareButtons'
import QRCodeSection from '../../components/QRCodeSection'
import { REFER_EARN_CONSTANTS } from '../../constants/referEarn'

export default function ReferEarnScreen({ navigation }: Readonly<RootStackScreenProps<'ReferEarn'>>) {
  const [referralCode] = useState(REFER_EARN_CONSTANTS.DEFAULT_REFERRAL_CODE)
  const [referralLink] = useState(REFER_EARN_CONSTANTS.DEFAULT_REFERRAL_LINK)

  const handleCopyCode = () => {
    Clipboard.setString(referralCode)
    Alert.alert('Copied', REFER_EARN_CONSTANTS.COPY_SUCCESS_MESSAGE)
  }

  const handleCopyLink = () => {
    Clipboard.setString(referralLink)
    Alert.alert('Copied', REFER_EARN_CONSTANTS.COPY_SUCCESS_MESSAGE)
  }

  const handleShare = async (platform: 'whatsapp' | 'telegram' | 'twitter') => {
    const shareMessage = `Join me on cKash! Use my referral code: ${referralCode} or visit: ${referralLink}`
    
    try {
      if (platform === 'whatsapp') {
        await Share.share({
          message: shareMessage,
          url: `whatsapp://send?text=${encodeURIComponent(shareMessage)}`,
        })
      } else if (platform === 'telegram') {
        await Share.share({
          message: shareMessage,
          url: `tg://msg?text=${encodeURIComponent(shareMessage)}`,
        })
      } else if (platform === 'twitter') {
        await Share.share({
          message: shareMessage,
          url: `twitter://post?message=${encodeURIComponent(shareMessage)}`,
        })
      }
    } catch (error) {
      console.error('Error sharing:', error)
      Alert.alert('Error', REFER_EARN_CONSTANTS.SHARE_ERROR_MESSAGE)
    }
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>Refer a user via your code to earn rewards</Text>
        </View>

        {/* QR Code Section */}
        <QRCodeSection
          qrCodeComponent={<QrCodeIcon width={REFER_EARN_CONSTANTS.QR_CODE_SIZE} height={REFER_EARN_CONSTANTS.QR_CODE_SIZE} />}
        />

        {/* Referral Code Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Invite via (Referral Code)</Text>
          <CopyableField
            label="My Referral Code"
            value={referralCode}
            onCopy={handleCopyCode}
          />
        </View>

        {/* Referral Link Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Invite Link</Text>
          <CopyableField
            label="My Referral Link"
            value={referralLink}
            onCopy={handleCopyLink}
          />
        </View>

        {/* Share Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Share to</Text>
          <SocialShareButtons
            onShare={handleShare}
            platforms={REFER_EARN_CONSTANTS.SUPPORTED_PLATFORMS}
          />
        </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.contentPrimary,
    marginBottom: 8,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    color: colors.contentSecondary,
    textAlign: 'left',
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.contentPrimary,
    marginBottom: 12,
  },
})
