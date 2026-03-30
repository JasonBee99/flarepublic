// src/collections/FocusGroupMembers.ts
// Membership records linking users to focus groups.
// One record per user per group. Status controls active/waitlist/expert slot.

import type { CollectionConfig, Access } from 'payload'
import { authenticated } from '../access/authenticated'

const readAccess: any = ({ req: { user } }) => {
  if (!user) return false
  const role = (user as any).role
  if (role === 'siteAdmin') return true
  if (role === 'countyOrganizer') {
    const countyId = typeof (user as any).county === 'object'
      ? (user as any).county?.id
      : (user as any).county
    if (!countyId) return false
    // Organizers can read all memberships in their county's groups
    // (filtered at query time by joining through focus-groups)
    return true
  }
  // Members can read their own memberships
  return { user: { equals: user.id } }
}

export const FocusGroupMembers: CollectionConfig = {
  slug: 'focus-group-members',
  access: {
    create: authenticated,
    read: readAccess,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    defaultColumns: ['user', 'focusGroup', 'role', 'status', 'joinedAt'],
    useAsTitle: 'id',
    group: 'County',
  },
  fields: [
    {
      name: 'focusGroup',
      type: 'relationship',
      relationTo: 'focus-groups',
      required: true,
      index: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'member',
      options: [
        { label: 'Member',    value: 'member'    },
        { label: 'Expert',    value: 'expert'    },
        { label: 'Organizer', value: 'organizer' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active',           value: 'active'           },
        { label: 'Waitlist',         value: 'waitlist'         },
        { label: 'Expert Volunteer', value: 'expert-volunteer' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'joinedAt',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
  ],
  timestamps: true,
}
