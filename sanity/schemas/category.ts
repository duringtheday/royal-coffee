import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Categories',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Category Name',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'emoji',
      title: 'Emoji Icon',
      type: 'string',
      description: 'e.g. ☕ ❄ 🍃 🥐',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'emoji' },
  },
})
