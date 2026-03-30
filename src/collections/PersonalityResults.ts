// src/collections/PersonalityResults.ts
// Stores personality test results per user — one record per user (upserted).
// County Organizers can read results for members in their county.
// Site Admins see all.

import type { CollectionConfig, Access } from 'payload'
import { authenticated } from '../access/authenticated'

const readAccess: any = ({ req: { user } }: any) => {
  if (!user) return false
  const role = (user as any).role
  if (role === 'siteAdmin') return true
  if (role === 'countyOrganizer') {
    // Can read results for members in their county
    const countyId = typeof (user as any).county === 'object'
      ? (user as any).county?.id
      : (user as any).county
    if (!countyId) return false
    return { 'county': { equals: countyId } }
  }
  // Regular members can only read their own
  return { user: { equals: user.id } }
}

export const PersonalityResults: CollectionConfig = {
  slug: 'personality-results',
  access: {
    create: authenticated,
    read: readAccess,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    defaultColumns: ['user', 'dominantType', 'choleric', 'completedAt', 'county'],
    useAsTitle: 'id',
    group: 'Learning',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'One result record per user' },
    },
    {
      name: 'county',
      type: 'relationship',
      relationTo: 'counties',
      index: true,
      admin: { description: 'Snapshot of user county at time of test — for organizer reporting' },
    },
    // Raw scores
    {
      name: 'sanguine',
      type: 'number',
      required: true,
      admin: { description: 'Total Sanguine score (0–40)' },
    },
    {
      name: 'choleric',
      type: 'number',
      required: true,
      admin: { description: 'Total Choleric score (0–40)' },
    },
    {
      name: 'melancholy',
      type: 'number',
      required: true,
      admin: { description: 'Total Melancholy score (0–40)' },
    },
    {
      name: 'phlegmatic',
      type: 'number',
      required: true,
      admin: { description: 'Total Phlegmatic score (0–40)' },
    },
    {
      name: 'dominantType',
      type: 'select',
      required: true,
      options: [
        { label: 'Sanguine', value: 'S' },
        { label: 'Choleric', value: 'C' },
        { label: 'Melancholy', value: 'M' },
        { label: 'Phlegmatic', value: 'P' },
      ],
      admin: { description: 'Highest scoring type', position: 'sidebar' },
    },
    {
      name: 'completedAt',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'organizerNote',
      type: 'textarea',
      admin: {
        description: 'County Organizer notes about this member (not visible to member)',
        condition: (_data, siblingData, { user }: any) =>
          user?.role === 'siteAdmin' || user?.role === 'countyOrganizer',
      },
    },
  ],
  timestamps: true,
}
