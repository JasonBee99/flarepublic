import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'

export const Documents: CollectionConfig = {
  slug: 'documents',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'category', 'fileType', 'updatedAt'],
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
      name: 'category',
      type: 'relationship',
      relationTo: 'document-categories',
      required: true,
      admin: {
        description: 'Select or create a category in Document Categories',
      },
    },
    {
      name: 'fileType',
      type: 'relationship',
      relationTo: 'file-types',
      required: true,
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Upload PDF or spreadsheet file',
      },
    },
    {
      name: 'externalUrl',
      type: 'text',
      admin: {
        description: 'Use this instead of a file upload for external links',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      admin: {
        description: 'Article body text (plain text, imported from external source)',
      },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      admin: {
        description: 'Original source URL this content was imported from',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: '_status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'published',
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
