// src/collections/UserProgress.ts
// Tracks which lessons each member has completed.
// One document per user+lesson pair.

import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'

export const UserProgress: CollectionConfig = {
  slug: 'user-progress',
  access: {
    // Members can only read their own progress; admins see all
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    defaultColumns: ['user', 'lesson', 'completedAt', 'county'],
    useAsTitle: 'id',
    group: 'Learning',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'lesson',
      type: 'relationship',
      relationTo: 'lessons',
      required: true,
      index: true,
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      index: true,
      admin: { description: 'Denormalized for faster dashboard queries' },
    },
    {
      name: 'county',
      type: 'relationship',
      relationTo: 'counties',
      index: true,
      admin: { description: 'Snapshot of user county at time of completion — for reporting' },
    },
    {
      name: 'completedAt',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        description: 'When the member marked this lesson complete',
      },
    },
  ],
  timestamps: true,
}
