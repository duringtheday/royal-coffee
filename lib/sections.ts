export type SectionId = 'hero' | 'menu' | 'gallery' | 'about' | 'location' | 'contact'

export const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'hero', label: 'Home' },
  { id: 'menu', label: 'Menu' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'about', label: 'Our Story' },
  { id: 'location', label: 'Find Us' },
  { id: 'contact', label: 'Connect' },
]