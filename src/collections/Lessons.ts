// src/collections/Lessons.ts
// Individual lessons within a course.
// Types: richtext, pdf (link), video (YouTube/Vimeo embed URL)

import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Lessons: CollectionConfig = {
  slug: 'lessons',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'course', 'type', 'order', 'estimatedMinutes'],
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
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      admin: { description: 'Which course this lesson belongs to' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Position within the course — lower numbers appear first',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'richtext',
      options: [
        { label: 'Article (rich text)', value: 'richtext' },
        { label: 'PDF', value: 'pdf' },
        { label: 'Video', value: 'video' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'estimatedMinutes',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Estimated time to complete this lesson (minutes)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Inactive lessons are hidden from members',
      },
    },
    // Rich text content — shown when type = richtext
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          HorizontalRuleFeature(),
        ],
      }),
      admin: {
        description: 'Used when type is Article',
        condition: (data) => data.type === 'richtext',
      },
    },
    // PDF URL or uploaded file
    {
      name: 'pdfUrl',
      type: 'text',
      admin: {
        description: 'Direct URL to the PDF (external link or /documents/filename.pdf)',
        condition: (data) => data.type === 'pdf',
      },
    },
    {
      name: 'pdfFile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Or upload the PDF directly',
        condition: (data) => data.type === 'pdf',
      },
    },
    // Video embed URL
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        description: 'YouTube or Vimeo URL — e.g. https://www.youtube.com/watch?v=...',
        condition: (data) => data.type === 'video',
      },
    },
    {
      name: 'videoCaption',
      type: 'text',
      admin: {
        description: 'Optional caption shown below the video',
        condition: (data) => data.type === 'video',
      },
    },
    // Optional notes shown after any lesson type
    {
      name: 'notes',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      admin: {
        description: 'Optional notes or discussion prompts shown below the lesson content',
      },
    },
  ],
  timestamps: true,
}
