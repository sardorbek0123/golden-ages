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

