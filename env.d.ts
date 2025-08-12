
declare module '@env' {
  export const API_KEY: string
  export const BASE_URL: string
  
  // Zendesk Configuration
  export const ZENDESK_SUBDOMAIN: string
  export const ZENDESK_API_TOKEN: string
  export const ZENDESK_EMAIL: string
  export const ZENDESK_BASE_URL: string
  
  // Development/Production Flags
  export const NODE_ENV: string
}
