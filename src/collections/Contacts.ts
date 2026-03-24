import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'

export const Contacts: CollectionConfig = {
  slug: 'contacts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'county', 'role', 'isActive'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'relationship',
      relationTo: 'roles',
      admin: { description: 'e.g. County Organizer, Webmaster, Justice, Clerk' },
    },
    {
      name: 'county',
      type: 'relationship',
      relationTo: 'counties',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'emailSubject',
      type: 'text',
      admin: { description: 'Suggested email subject line' },
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower number appears first within their county',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
