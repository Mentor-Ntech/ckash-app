// Refer & Earn Screen Constants
export const REFER_EARN_CONSTANTS = {
  // Default values
  DEFAULT_REFERRAL_CODE: '105646516',
  DEFAULT_REFERRAL_LINK: 'www.ckash.app/user10565468',
  
  // UI Constants
  QR_CODE_SIZE: 160,
  ICON_SIZE: 32,
  ICON_GAP: 4,
  
  // Messages
  COPY_SUCCESS_MESSAGE: 'Copied to clipboard',
  SHARE_ERROR_MESSAGE: 'Unable to share at this time',
  
  // Social Platforms
  SUPPORTED_PLATFORMS: ['whatsapp', 'telegram', 'twitter'] as const,
} as const

export type SupportedPlatform = typeof REFER_EARN_CONSTANTS.SUPPORTED_PLATFORMS[number]
