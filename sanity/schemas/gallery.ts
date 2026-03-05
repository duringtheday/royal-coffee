import { defineField, defineType } from 'sanity'

export const gallery = defineType({
  name: 'gallery',
  title: 'Gallery',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title / Caption',
      type: 'string',
    }),
    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      options: {
        list: [
          { title: 'Photo', value: 'photo' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'photo',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ document }) => document?.mediaType === 'video',
    }),
    defineField({
      name: 'video',
      title: 'Video File',
      type: 'file',
      options: { accept: 'video/*' },
      hidden: ({ document }) => document?.mediaType === 'photo',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Drag to reorder in the gallery',
    }),
  ],
  preview: {
    select: { title: 'title', media: 'photo' },
  },
})
