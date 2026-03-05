import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'royal-coffee-studio',
  title: '👑 Royal Coffee — Owner Dashboard',
  projectId: 'v2e1ehrq',
  dataset: 'production',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
})