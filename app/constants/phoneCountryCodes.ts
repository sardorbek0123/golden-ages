export interface PhoneCountryOption {
  dial: string
  label: string
  /** Flag emoji shown in the unified phone field */
  flag: string
}

/** Unique calling codes for the country selector (E.164 prefixes). */
export const PHONE_COUNTRY_CODES: PhoneCountryOption[] = [
  { dial: '+998', label: 'UZ', flag: '🇺🇿' },
  { dial: '+7', label: 'RU / KZ', flag: '🇷🇺' },
  { dial: '+1', label: 'US / CA', flag: '🇺🇸' },
  { dial: '+44', label: 'GB', flag: '🇬🇧' },
  { dial: '+49', label: 'DE', flag: '🇩🇪' },
  { dial: '+33', label: 'FR', flag: '🇫🇷' },
  { dial: '+39', label: 'IT', flag: '🇮🇹' },
  { dial: '+34', label: 'ES', flag: '🇪🇸' },
  { dial: '+90', label: 'TR', flag: '🇹🇷' },
  { dial: '+86', label: 'CN', flag: '🇨🇳' },
  { dial: '+81', label: 'JP', flag: '🇯🇵' },
  { dial: '+82', label: 'KR', flag: '🇰🇷' },
  { dial: '+91', label: 'IN', flag: '🇮🇳' },
  { dial: '+971', label: 'AE', flag: '🇦🇪' },
  { dial: '+966', label: 'SA', flag: '🇸🇦' },
  { dial: '+20', label: 'EG', flag: '🇪🇬' },
  { dial: '+27', label: 'ZA', flag: '🇿🇦' },
  { dial: '+61', label: 'AU', flag: '🇦🇺' },
  { dial: '+55', label: 'BR', flag: '🇧🇷' },
  { dial: '+52', label: 'MX', flag: '🇲🇽' },
  { dial: '+380', label: 'UA', flag: '🇺🇦' },
  { dial: '+375', label: 'BY', flag: '🇧🇾' },
  { dial: '+996', label: 'KG', flag: '🇰🇬' },
  { dial: '+992', label: 'TJ', flag: '🇹🇯' },
  { dial: '+993', label: 'TM', flag: '🇹🇲' },
  { dial: '+994', label: 'AZ', flag: '🇦🇿' },
  { dial: '+995', label: 'GE', flag: '🇬🇪' },
  { dial: '+373', label: 'MD', flag: '🇲🇩' },
  { dial: '+374', label: 'AM', flag: '🇦🇲' },
  { dial: '+972', label: 'IL', flag: '🇮🇱' },
  { dial: '+48', label: 'PL', flag: '🇵🇱' },
  { dial: '+31', label: 'NL', flag: '🇳🇱' },
  { dial: '+32', label: 'BE', flag: '🇧🇪' },
  { dial: '+41', label: 'CH', flag: '🇨🇭' },
  { dial: '+43', label: 'AT', flag: '🇦🇹' },
  { dial: '+46', label: 'SE', flag: '🇸🇪' },
  { dial: '+47', label: 'NO', flag: '🇳🇴' },
  { dial: '+45', label: 'DK', flag: '🇩🇰' },
  { dial: '+358', label: 'FI', flag: '🇫🇮' },
  { dial: '+353', label: 'IE', flag: '🇮🇪' },
  { dial: '+351', label: 'PT', flag: '🇵🇹' },
  { dial: '+30', label: 'GR', flag: '🇬🇷' },
  { dial: '+420', label: 'CZ', flag: '🇨🇿' },
  { dial: '+36', label: 'HU', flag: '🇭🇺' },
  { dial: '+40', label: 'RO', flag: '🇷🇴' },
  { dial: '+359', label: 'BG', flag: '🇧🇬' },
  { dial: '+385', label: 'HR', flag: '🇭🇷' },
  { dial: '+386', label: 'SI', flag: '🇸🇮' },
  { dial: '+421', label: 'SK', flag: '🇸🇰' },
  { dial: '+370', label: 'LT', flag: '🇱🇹' },
  { dial: '+371', label: 'LV', flag: '🇱🇻' },
  { dial: '+372', label: 'EE', flag: '🇪🇪' },
  { dial: '+852', label: 'HK', flag: '🇭🇰' },
  { dial: '+886', label: 'TW', flag: '🇹🇼' },
  { dial: '+65', label: 'SG', flag: '🇸🇬' },
  { dial: '+60', label: 'MY', flag: '🇲🇾' },
  { dial: '+66', label: 'TH', flag: '🇹🇭' },
  { dial: '+84', label: 'VN', flag: '🇻🇳' },
  { dial: '+62', label: 'ID', flag: '🇮🇩' },
  { dial: '+63', label: 'PH', flag: '🇵🇭' },
  { dial: '+92', label: 'PK', flag: '🇵🇰' },
  { dial: '+880', label: 'BD', flag: '🇧🇩' },
  { dial: '+94', label: 'LK', flag: '🇱🇰' },
  { dial: '+976', label: 'MN', flag: '🇲🇳' }
]

export const PHONE_COUNTRY_CODES_SORTED: PhoneCountryOption[] = (() => {
  const uz = PHONE_COUNTRY_CODES.filter(c => c.dial === '+998')
  const rest = PHONE_COUNTRY_CODES
    .filter(c => c.dial !== '+998')
    .sort((a, b) => a.label.localeCompare(b.label))
  return [...uz, ...rest]
})()

export const PHONE_DIAL_CODES_LONGEST_FIRST: string[] = Array.from(
  new Set(PHONE_COUNTRY_CODES.map(c => c.dial))
).sort((a, b) => b.length - a.length)

export function matchDialFromFull(full: string): string | null {
  if (!full.startsWith('+')) return null
  for (const dial of PHONE_DIAL_CODES_LONGEST_FIRST) {
    if (full.startsWith(dial)) return dial
  }
  return null
}
