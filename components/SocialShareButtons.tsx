import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import WhatsappIcon from '../assets/icons/whatsapp.svg'
import TelegramBlueIcon from '../assets/icons/telegram-blue-icon.svg'
import XLogoIcon from '../assets/icons/x-logo-icon.svg'

type Platform = 'whatsapp' | 'telegram' | 'twitter'

interface SocialShareButtonsProps {
  onShare: (platform: Platform) => void
  platforms?: readonly Platform[]
}

const ICON_SIZE = 32
const ICON_GAP = 4

export default function SocialShareButtons({ 
  onShare, 
  platforms = ['whatsapp', 'telegram', 'twitter'] as const
}: Readonly<SocialShareButtonsProps>) {
  const renderIcon = (platform: Platform) => {
    switch (platform) {
      case 'whatsapp':
        return <WhatsappIcon width={ICON_SIZE} height={ICON_SIZE} />
      case 'telegram':
        return <TelegramBlueIcon width={ICON_SIZE} height={ICON_SIZE} />
      case 'twitter':
        return <XLogoIcon width={ICON_SIZE} height={ICON_SIZE} />
      default:
        return null
    }
  }

  return (
    <View style={styles.shareButtons}>
      {platforms.map((platform) => (
        <TouchableOpacity
          key={platform}
          style={styles.shareButton}
          onPress={() => onShare(platform)}
        >
          {renderIcon(platform)}
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  shareButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  shareButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: ICON_GAP,
  },
})
