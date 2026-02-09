export interface NavItem {
    key: string
    href?: string
    hasDropdown?: boolean
    matchPath?: string
}

export const navItems: NavItem[] = [
    { key: 'tours', hasDropdown: true, matchPath: '/tours' },
    { key: 'aboutUs', href: '/about' },
    { key: 'cities', hasDropdown: true },
    // { key: 'shop', href: '/shop' },
    { key: 'culture', href: '/culture' },
    { key: 'contacts', href: '/contacts' }
]