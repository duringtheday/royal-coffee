import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  name: 'royal-coffee-studio',
  title: '👑 Royal Coffee — Owner Dashboard',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Royal Coffee Dashboard')
          .items([
            S.listItem()
              .title('⚙️ Site Settings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.divider(),
            S.listItem()
              .title('📂 Categories')
              .child(S.documentTypeList('category').title('Categories')),
            S.listItem()
              .title('☕ Products & Services')
              .child(S.documentTypeList('product').title('Products & Services')),
            S.listItem()
             .title('📸 Gallery')
             .child(S.documentTypeList('gallery').title('Gallery')),
            S.divider(),
            S.listItem()
             .title('🧾 Orders')
             .child(S.documentTypeList('order').title('Orders')),
            S.divider(),
            S.listItem()
             .title('📝 Owner Notes')
             .child(S.documentTypeList('note').title('Owner Notes')),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
})
