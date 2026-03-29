// src/collections/FocusGroups.ts
// Focus Groups — small county-level groups (max 6 active members by default).
// Created by County Organizers, managed through the organizer dashboard.

import type { CollectionConfig, Access } from 'payload'
import { authenticated } from '../access/authenticated'

const readAccess: Access = ({ req: { user } }) => {
  if (!user) return false
  const role = (user as any).role
  if (role === 'siteAdmin') return true
  // Members and organizers can read groups in their county
  const countyId = typeof (user as any).county === 'object'
    ? (user as any).county?.id
    : (user as any).county
  if (!countyId) return false
  return { county: { equals: countyId } }
}

const writeAccess: Access = ({ req: { user } }) => {
  if (!user) return false
  const role = (user as any).role
  return role === 'countyOrganizer' || role === 'siteAdmin'
}

export const FocusGroups: CollectionConfig = {
  slug: 'focus-groups',
  access: {
    create: writeAccess,
    read: readAccess,
    update: writeAccess,
    delete: writeAccess,
  },
  admin: {
    defaultColumns: ['title', 'county', 'stage', 'isActive', 'maxMembers'],
    useAsTitle: 'title',
    group: 'County',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'county',
      type: 'relationship',
      relationTo: 'counties',
      required: true,
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'stage',
      type: 'select',
      required: true,
      defaultValue: 'forming',
      options: [
        { label: 'Forming',    value: 'forming'    },
        { label: 'Active',     value: 'active'     },
        { label: 'Completed',  value: 'completed'  },
        { label: 'On Hold',    value: 'on-hold'    },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'maxMembers',
      type: 'number',
      defaultValue: 6,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Max active members (default 6). Overflow goes to waitlist.',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Inactive groups are hidden from members.',
      },
    },
    {
      name: 'organizer',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        description: 'County Organizer responsible for this group.',
      },
    },
  ],
  timestamps: true,
}
