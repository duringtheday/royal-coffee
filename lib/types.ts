export interface SiteSettings {
  businessName: string
  tagline: string
  logo?: { asset: { url: string } }
  about: string
  phone1: string
  phone2: string
  email?: string
  address: string
  hoursWeekday: string
  hoursWeekend: string
  whatsapp: string
  telegram: string
  instagram?: string
  facebook?: string
  tiktok?: string
  mapEmbedUrl?: string
  googleMapsLink?: string
  payments?: { name: string; abbreviation: string; active: boolean }[]
  heroImage?: { asset: { url: string } }
}

export interface Category {
  _id: string
  name: string
  emoji: string
  order: number
}

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  badge?: string
  image: string
  category: { _id: string; name: string; emoji: string }
}

export interface GalleryItem {
  _id: string
  title: string
  mediaType: 'photo' | 'video'
  photo?: string
  video?: string
}
