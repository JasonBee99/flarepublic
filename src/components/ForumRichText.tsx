// src/components/ForumRichText.tsx
// Thin wrapper around the site's RichText component tuned for forum posts.
// - No gutter / container class (forum has its own padding)
// - prose-sm for compact forum text
// - Handles both Lexical JSON (from Payload) and plain strings gracefully

import RichText from '@/components/RichText'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

type Props = {
  body: unknown
  className?: string
}

function isLexicalState(val: unknown): val is DefaultTypedEditorState {
  return (
    typeof val === 'object' &&
    val !== null &&
    'root' in val
  )
}

export function ForumRichText({ body, className }: Props) {
  // Proper Lexical JSON — use the full RichText renderer
  if (isLexicalState(body)) {
    return (
      <RichText
        data={body}
        enableGutter={false}
        enableProse={true}
        className={`prose prose-sm max-w-none dark:prose-invert ${className ?? ''}`}
      />
    )
  }

  // Plain string fallback (e.g. legacy data or direct string)
  if (typeof body === 'string' && body.trim()) {
    return (
      <div className={`prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap ${className ?? ''}`}>
        {body}
      </div>
    )
  }

  return null
}
