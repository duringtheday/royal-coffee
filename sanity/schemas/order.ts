import { defineField, defineType } from 'sanity'

export const order = defineType({
  name: 'order',
  title: 'Orders',
  type: 'document',
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
    }),
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
    }),
    defineField({
      name: 'customerContact',
      title: 'Customer Contact (WhatsApp/Telegram/Phone)',
      type: 'string',
    }),
    defineField({
      name: 'source',
      title: 'Order Source',
      type: 'string',
      options: {
        list: [
          { title: 'WhatsApp', value: 'whatsapp' },
          { title: 'Telegram', value: 'telegram' },
          { title: 'In Person', value: 'inperson' },
          { title: 'Online', value: 'online' },
          { title: 'Phone', value: 'phone' },
        ],
      },
    }),
    defineField({
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'productName', title: 'Product Name', type: 'string' }),
            defineField({ name: 'quantity', title: 'Quantity', type: 'number' }),
            defineField({ name: 'unitPrice', title: 'Unit Price', type: 'number' }),
            defineField({ name: 'subtotal', title: 'Subtotal', type: 'number' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'total',
      title: 'Total (USD)',
      type: 'number',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'pending',
      options: {
        list: [
          { title: '🟡 Pending', value: 'pending' },
          { title: '✅ Confirmed', value: 'confirmed' },
          { title: '🔄 Modified', value: 'modified' },
          { title: '❌ Cancelled', value: 'cancelled' },
          { title: '💰 Refunded', value: 'refunded' },
        ],
      },
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
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'createdAt',
      title: 'Order Date',
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
    select: {
      title: 'orderNumber',
      subtitle: 'status',
      description: 'total',
    },
    prepare({ title, subtitle, description }) {
      return {
        title: title || 'Order',
        subtitle: `${subtitle} — $${description}`,
      }
    },
  },
})