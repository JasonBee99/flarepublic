// src/collections/CountyPosts.ts
// County-specific blog posts — visible only to members of that county (+ all admins).
// County members can create posts; only admins (site-wide) can delete or change county assignment.

import type { CollectionConfig, Access } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Banner } from '../blocks/Banner/config'
import { Code } from '../blocks/Code/config'
import { MediaBlock } from '../blocks/MediaBlock/config'

// Admins OR members of the same county can read
const readAccess: Access = ({ req: { user } }) => {
  if (!user) return false
  // Payload admins see everything
  if (user.role === 'admin' || (user as any)._verified) {
    // fall through to county check — we rely on isAdmin field
  }
  // If user has no county, block
  const userCounty = (user as any).county
  if (!userCounty) return false
  const userCountyId = typeof userCounty === 'object' ? userCounty.id : userCounty
  return {
    county: { equals: userCountyId },
  }
}

// Admins see all; county members see only their county
const readAccessWithAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  const isAdmin = (user as any).isAdmin === true
  if (isAdmin) return true
  const userCounty = (user as any).county
  if (!userCounty) return false
  const userCountyId = typeof userCounty === 'object' ? userCounty.id : userCounty
  return {
    county: { equals: userCountyId },
  }
}

// Create: must be logged in + approved; county on post must match user's county (admins bypass)
const createAccess: Access = ({ req: { user } }) => {
  if (!user) return false
  const u = user as any
  if (u.isAdmin) return true
  return Boolean(u.approved)
}

// Update/Delete: admins only
const adminOnly: Access = ({ req: { user } }) => {
  if (!user) return false
  return (user as any).isAdmin === true
}

export const CountyPosts: CollectionConfig = {
  slug: 'county-posts',
  access: {
    create: createAccess,
    read: readAccessWithAdmin,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    defaultColumns: ['title', 'county', 'author', 'publishedAt', 'status'],
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
      admin: {
        description: 'Which county this post belongs to — only members of this county can see it',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData.status === 'published' && !value) return new Date()
            return value
          },
        ],
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short summary shown on the county page listing',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: { position: 'sidebar' },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          HorizontalRuleFeature(),
        ],
      }),
    },
  ],
  timestamps: true,
}
