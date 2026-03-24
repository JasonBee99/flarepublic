// src/globals/types.ts
// Auto-shape matching the MainNav global fields.
// When you run `npm run generate:types`, Payload will produce a full
// PayloadTypes file — until then, use these hand-typed interfaces.

export interface NavItem {
  label: string
  url: string
  description?: string
  requiresAuth?: boolean
  requiresApproval?: boolean
}

export interface NavGroup {
  label: string
  type: 'link' | 'dropdown'
  url?: string // only when type === 'link'
  requiresAuth?: boolean
  requiresApproval?: boolean
  items?: NavItem[] // only when type === 'dropdown'
}

export interface MainNavGlobal {
  groups: NavGroup[]
}
