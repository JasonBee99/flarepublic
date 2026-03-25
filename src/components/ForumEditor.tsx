'use client'
// src/components/ForumEditor.tsx
// Tiptap rich text editor — used in new thread and reply forms.
// Outputs HTML string; stored as-is in Payload (body field accepts richText or string).

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

type Props = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: string
}

type ToolbarButtonProps = {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`rounded px-2 py-1 text-sm font-medium transition
        ${active
          ? 'bg-primary text-white'
          : 'text-foreground hover:bg-muted'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {children}
    </button>
  )
}

export function ForumEditor({ value, onChange, placeholder = 'Write here…', minHeight = '160px' }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        blockquote: {},
        bulletList: {},
        orderedList: {},
        code: {},
        codeBlock: {},
        horizontalRule: {},
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary underline' },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[var(--editor-min-height)] px-4 py-3 text-sm text-foreground',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  // Sync external value reset (e.g. after form submit)
  useEffect(() => {
    if (editor && value === '' && editor.getText() !== '') {
      editor.commands.clearContent()
    }
  }, [value, editor])

  if (!editor) return null

  const setLink = () => {
    const prev = editor.getAttributes('link').href ?? ''
    const url = window.prompt('Enter URL', prev)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkToLink().unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkToLink().setLink({ href: url }).run()
  }

  return (
    <div
      className="rounded-md border border-border bg-background focus-within:ring-2 focus-within:ring-primary/50"
      style={{ '--editor-min-height': minHeight } as React.CSSProperties}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5">
        {/* Text style */}
        <ToolbarButton
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
        >
          <span className="underline">U</span>
        </ToolbarButton>
        <ToolbarButton
          title="Strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
        >
          <span className="line-through">S</span>
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" />

        {/* Headings */}
        <ToolbarButton
          title="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
        >
          H3
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" />

        {/* Lists */}
        <ToolbarButton
          title="Bullet list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          title="Numbered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          1. List
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" />

        {/* Block elements */}
        <ToolbarButton
          title="Blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
        >
          ❝
        </ToolbarButton>
        <ToolbarButton
          title="Code block"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
        >
          {'</>'}
        </ToolbarButton>
        <ToolbarButton
          title="Link"
          onClick={setLink}
          active={editor.isActive('link')}
        >
          🔗
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" />

        {/* History */}
        <ToolbarButton
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          ↩
        </ToolbarButton>
        <ToolbarButton
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          ↪
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  )
}
