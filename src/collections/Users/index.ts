import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: () => true,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'county', 'approved', 'isAdmin', 'createdAt'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'county',
      type: 'relationship',
      relationTo: 'counties',
      required: true,
      admin: { description: 'County this member is associated with' },
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'member',
      required: true,
      options: [
        { label: 'Member', value: 'member' },
        { label: 'County Organizer', value: 'countyOrganizer' },
        { label: 'Site Admin', value: 'siteAdmin' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Member = standard access. County Organizer = manages their county. Site Admin = full access.',
      },
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Admin must approve before member can access forum and protected content',
      },
    },
    {
      name: 'approvedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Date admin approved this account',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'Internal admin notes about this member',
      },
    },
  ],
  timestamps: true,
}
