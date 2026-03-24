import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'

export const DocumentCategories: CollectionConfig = {
  slug: 'document-categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'description'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Controls sort order on the documents page',
      },
    },
  ],
  timestamps: true,
}
