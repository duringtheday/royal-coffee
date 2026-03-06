import { defineField, defineType } from 'sanity'

export const note = defineType({
  name: 'note',
  title: 'Private Notes',
  type: 'document',
  fields: [
    defineField({
      name: 'content',
      title: 'Note',
      type: 'text',
      rows: 4,
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'createdAt',
      title: 'Date & Time',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: 'Newest First',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'content' },
    prepare({ title }) {
      return { title: title?.substring(0, 60) || 'Note' }
    },
  },
})