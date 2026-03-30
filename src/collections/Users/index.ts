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
      required: false,
      admin: { description: 'County this member is associated with (not required for Site Admins)' },
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
    {
      name: 'mustResetPassword',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'If checked, user will be prompted to reset password on next login.',
      },
    },
    {
      name: 'importedFrom',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Source of import (e.g. wordpress-2024)',
      },
    },
    {
      name: 'contactInfo',
      type: 'group',
      label: 'Contact Information',
      admin: {
        description: 'Member-provided contact details. Visible to County Organizers and Site Admins.',
      },
      fields: [
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
        },
        {
          name: 'address',
          type: 'text',
          label: 'Address',
        },
        {
          name: 'secondaryEmail',
          type: 'email',
          label: 'Secondary Email',
        },
      ],
    },
  ],
  timestamps: true,
}
