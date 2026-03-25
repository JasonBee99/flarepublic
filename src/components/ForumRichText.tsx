// src/components/ForumRichText.tsx
// Renders forum post bodies — handles both Payload Lexical JSON and Tiptap HTML strings.

import RichText from '@/components/RichText'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

type Props = {
  body: unknown
  className?: string
}

function isLexicalState(val: unknown): val is DefaultTypedEditorState {
  return typeof val === 'object' && val !== null && 'root' in val
}

function isHtmlString(val: unknown): val is string {
  return typeof val === 'string' && val.trimStart().startsWith('<')
}

export function ForumRichText({ body, className }: Props) {
  // Payload Lexical JSON
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

  // Tiptap HTML string
  if (isHtmlString(body)) {
    return (
      <div
        className={`prose prose-sm max-w-none dark:prose-invert ${className ?? ''}`}
        dangerouslySetInnerHTML={{ __html: body }}
      />
    )
  }

  // Plain text fallback
  if (typeof body === 'string' && body.trim()) {
    return (
      <div className={`prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap ${className ?? ''}`}>
        {body}
      </div>
    )
  }

  return null
}
