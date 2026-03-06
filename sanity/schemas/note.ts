import { defineField, defineType } from 'sanity'

export const note = defineType({
  name: 'note',
  title: 'Owner Notes',
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
      name: 'type',
      title: 'Type',
      type: 'string',
      initialValue: 'observation',
      options: {
        list: [
          { title: '📦 Supplier / Proveedor', value: 'supplier' },
          { title: '💸 Extra Expense / Gasto extra', value: 'expense' },
          { title: '📍 Location / Sector', value: 'location' },
          { title: '📊 Observation', value: 'observation' },
          { title: '🔔 Reminder', value: 'reminder' },
        ],
      },
    }),
    defineField({
      name: 'amount',
      title: 'Amount (USD) — for expenses only',
      type: 'number',
    }),
    defineField({
      name: 'sector',
      title: 'Sector',
      type: 'string',
      options: {
        list: [
          { title: '🪑 Dine-in', value: 'dinein' },
          { title: '🥡 Takeaway', value: 'takeaway' },
          { title: '🛵 Delivery', value: 'delivery' },
          { title: '💻 Online', value: 'online' },
          { title: '📞 Phone', value: 'phone' },
        ],
      },
    }),
    defineField({
      name: 'createdAt',
      title: 'Date & Time',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (R) => R.required(),
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
    select: {
      title: 'content',
      subtitle: 'type',
    },
    prepare({ title, subtitle }) {
      return {
        title: title?.substring(0, 60) || 'Note',
        subtitle,
      }
    },
  },
})