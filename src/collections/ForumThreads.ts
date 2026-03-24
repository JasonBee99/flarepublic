// src/collections/ForumThreads.ts
// Forum threads — created by approved members, moderated by admins + county moderators.

import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'

export const ForumThreads: CollectionConfig = {
  slug: 'forum-threads',
  access: {
    // Anyone logged in can create; approval handled by status field
    create: authenticated,
    // Reads are public-ish — page components handle approval gating
    read: authenticated,
    // Only admins and moderators should bulk-delete; inline handled by page
    delete: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'category', 'author', 'status', 'pinned', 'locked', 'createdAt'],
    useAsTitle: 'title',
    group: 'Forum',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'forum-categories',
      required: true,
      admin: { description: 'Which forum this thread belongs to' },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'approved',
      options: [
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Only approved threads are visible to members',
      },
    },
    {
      name: 'pinned',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Pinned threads appear at the top of the category',
      },
    },
    {
      name: 'locked',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Locked threads accept no new replies',
      },
    },
  ],
  timestamps: true,
}
