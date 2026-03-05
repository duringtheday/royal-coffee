import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    // ─── Business Info ───────────────────────────────────
    defineField({
      name: 'businessName',
      title: 'Business Name',
      type: 'string',
      initialValue: 'Royal Coffee & Tea',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      initialValue: 'Where every cup tells a story.',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'about',
      title: 'About / Story Text',
      type: 'text',
      rows: 6,
    }),

    // ─── Contact ─────────────────────────────────────────
    defineField({
      name: 'phone1',
      title: 'Phone Number 1',
      type: 'string',
      initialValue: '0969077311',
    }),
    defineField({
      name: 'phone2',
      title: 'Phone Number 2',
      type: 'string',
      initialValue: '017824500',
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      initialValue: 'Street 9, Pub Street Area, Siem Reap, Cambodia',
    }),

    // ─── Hours ───────────────────────────────────────────
    defineField({
      name: 'hoursWeekday',
      title: 'Hours — Monday to Friday',
      type: 'string',
      initialValue: '7:00 AM – 10:00 PM',
    }),
    defineField({
      name: 'hoursWeekend',
      title: 'Hours — Saturday & Sunday',
      type: 'string',
      initialValue: '7:00 AM – 11:00 PM',
    }),

    // ─── Social Media ─────────────────────────────────────
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp Number',
      description: 'With country code, no spaces. e.g. 85596907731',
      type: 'string',
    }),
    defineField({
      name: 'telegram',
      title: 'Telegram Username',
      description: 'Without @. e.g. royalcoffeekh',
      type: 'string',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'tiktok',
      title: 'TikTok URL',
      type: 'url',
    }),

    // ─── Map ─────────────────────────────────────────────
    defineField({
      name: 'mapEmbedUrl',
      title: 'Google Maps Embed URL',
      description: 'Go to Google Maps → Share → Embed a map → copy the src URL only',
      type: 'url',
    }),
    defineField({
      name: 'googleMapsLink',
      title: 'Google Maps Direct Link',
      description: 'For the "Get Directions" button',
      type: 'url',
    }),

    // ─── Payments ─────────────────────────────────────────
    defineField({
      name: 'payments',
      title: 'Accepted Payment Methods',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Payment Name', type: 'string' },
            { name: 'abbreviation', title: 'Abbreviation', type: 'string' },
            { name: 'active', title: 'Active', type: 'boolean', initialValue: true },
          ],
        },
      ],
    }),

    // ─── Hero Banner ─────────────────────────────────────
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image (optional)',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
