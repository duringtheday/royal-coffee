import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const isSanityConnected = Boolean(projectId && projectId !== 'placeholder')

export const client = createClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)
export const urlFor = (source: SanityImageSource) => builder.image(source)

export const SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  businessName, tagline, logo, about,
  phone1, phone2, email, address,
  hoursWeekday, hoursWeekend,
  whatsapp, telegram, instagram, facebook, tiktok,
  mapEmbedUrl, googleMapsLink,
  payments, heroImage
}`

export const CATEGORIES_QUERY = `*[_type == "category"] | order(order asc){
  _id, name, emoji, order
}`

export const PRODUCTS_QUERY = `*[_type == "product" && available == true] | order(order asc){
  _id, name, description, price, badge,
  "image": image.asset->url,
  "category": category->{ _id, name, emoji }
}`

export const GALLERY_QUERY = `*[_type == "gallery"] | order(order asc){
  _id, title, mediaType,
  "photo": photo.asset->url,
  "video": video.asset->url
}`