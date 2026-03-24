// src/collections/ForumReplies.ts
// Replies to forum threads — supports one level of nesting via parentReply.

import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'

export const ForumReplies: CollectionConfig = {
  slug: 'forum-replies',
  access: {
    create: authenticated,
    read: authenticated,
    delete: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['thread', 'author', 'status', 'createdAt'],
    useAsTitle: 'id',
    group: 'Forum',
  },
  fields: [
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
    {
      name: 'thread',
      type: 'relationship',
      relationTo: 'forum-threads',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'parentReply',
      type: 'relationship',
      relationTo: 'forum-replies',
      admin: {
        description: 'Set this to nest a reply under another reply (one level deep)',
      },
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
        description: 'Only approved replies are visible to members',
      },
    },
  ],
  timestamps: true,
}
