// src/collections/Courses.ts
// Learning module courses — ordered collections of lessons.
// Admins manage these; members work through them.

import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'

export const Courses: CollectionConfig = {
  slug: 'courses',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'stage', 'order', 'isActive'],
    useAsTitle: 'title',
    group: 'Learning',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL slug — e.g. "fast-track" — lowercase, no spaces' },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Shown on the course listing page' },
    },
    {
      name: 'stage',
      type: 'select',
      defaultValue: 'inactive',
      options: [
        { label: 'Inactive Stage (now)', value: 'inactive' },
        { label: 'Stage I — Founders', value: 'stage1' },
        { label: 'Stage II — Hired Founders', value: 'stage2' },
        { label: 'Stage III — Assemblies', value: 'stage3' },
        { label: 'All Stages', value: 'all' },
      ],
      admin: { description: 'Which stage of the movement this course is relevant to' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first',
      },
    },
    {
      name: 'estimatedMinutes',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Estimated total time to complete (minutes)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Inactive courses are hidden from members',
      },
    },
  ],
  timestamps: true,
}
