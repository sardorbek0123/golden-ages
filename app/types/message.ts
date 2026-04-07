/**
 * Message types for Golden Ages Travel API
 */

export interface UserMessageCreate {
  full_name: string
  email: string
  phone: string
  trip: number
  message: string
}

/** Minimal payload for quick lead capture (same `/messages/create/` endpoint when API allows). */
export interface UserMessageLead {
  full_name: string
  email: string
  phone: string
}

