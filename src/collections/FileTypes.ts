import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'

export const FileTypes: CollectionConfig = {
  slug: 'file-types',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['label', 'value'],
    useAsTitle: 'label',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: { description: 'Display name e.g. PDF, Spreadsheet, External Link' },
    },
    {
      name: 'value',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Internal key e.g. pdf, spreadsheet, link' },
    },
    {
      name: 'icon',
      type: 'text',
      admin: { description: 'Optional icon name from lucide-react e.g. FileText, Table, ExternalLink' },
    },
  ],
  timestamps: true,
}
