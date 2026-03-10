/**
 * Settings types for Golden Ages Travel API
 */

export interface SiteSettings {
  id: number
  facebook?: string
  linkedin?: string
  instagram?: string
  twitter?: string
  telegram?: string
  whatsapp?: string
  home_page_video?: string | null
  email?: string
  phone_number?: string
  certificate?: string
  general_inquiry_email?: string
  general_inquiry_number?: string
  technical_support_email?: string
  technical_support_number?: string
  address?: string
  address_lat?: number
  address_long?: number
  office_hours?: string
}

