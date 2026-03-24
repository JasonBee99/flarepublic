'use client'

// src/Header/Nav/index.tsx
// Renders the main site navigation using Radix UI NavigationMenu.
// - Dropdown groups use NavigationMenu.Sub with animated content panels
// - Items flagged requiresAuth are hidden from logged-out users
// - Items flagged requiresApproval are hidden unless user.approved === true
// - Active route is highlighted via usePathname()

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { ChevronDown } from 'lucide-react'
import type { NavGroup, NavItem } from '@/globals/types'
import { cn } from '@/utilities/cn' // adjust path if your project differs

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NavProps {
  groups: NavGroup[]
  /** Current authenticated user from Payload — null if logged out */
  user?: { approved?: boolean } | null
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isVisible(
  item: Pick<NavItem | NavGroup, 'requiresAuth' | 'requiresApproval'>,
  user: NavProps['user'],
): boolean {
  if (item.requiresApproval && !user?.approved) return false
  if (item.requiresAuth && !user) return false
  return true
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function DropdownItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <NavigationMenu.Link asChild active={isActive}>
      <Link
        href={item.url}
        className={cn(
          'group flex flex-col gap-0.5 rounded-md px-3 py-2.5 transition-colors',
          'hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          isActive && 'bg-primary/10 text-primary font-medium',
        )}
      >
        <span className="text-sm font-medium leading-none text-foreground group-hover:text-primary">
          {item.label}
        </span>
        {item.description && (
          <span className="text-xs text-muted-foreground leading-snug mt-0.5">
            {item.description}
          </span>
        )}
      </Link>
    </NavigationMenu.Link>
  )
}

// ---------------------------------------------------------------------------
// Main Nav Component
// ---------------------------------------------------------------------------

export function Nav({ groups, user }: NavProps) {
  const pathname = usePathname()

  const visibleGroups = groups.filter((g) => isVisible(g, user))

  return (
    <NavigationMenu.Root className="relative z-40 flex">
      <NavigationMenu.List className="flex items-center gap-1 list-none m-0 p-0">
        {visibleGroups.map((group) => {
          // ── Standalone link ──────────────────────────────────────────────
          if (group.type === 'link') {
            const isActive = pathname === group.url
            const isAuth = group.url === '/login' || group.url === '/register'

            return (
              <NavigationMenu.Item key={group.label}>
                <NavigationMenu.Link asChild active={isActive}>
                  <Link
                    href={group.url ?? '/'}
                    className={cn(
                      'inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                      'text-foreground/80 hover:text-foreground hover:bg-accent',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      isActive && 'text-primary bg-primary/10',
                      isAuth &&
                        group.url === '/register' &&
                        'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground',
                    )}
                  >
                    {group.label}
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            )
          }

          // ── Dropdown group ────────────────────────────────────────────────
          const visibleItems = (group.items ?? []).filter((item) => isVisible(item, user))
          if (visibleItems.length === 0) return null

          const groupIsActive = visibleItems.some((item) => pathname === item.url)

          return (
            <NavigationMenu.Item key={group.label}>
              <NavigationMenu.Trigger
                className={cn(
                  'group inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  'text-foreground/80 hover:text-foreground hover:bg-accent',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  'data-[state=open]:bg-accent data-[state=open]:text-foreground',
                  groupIsActive && 'text-primary',
                )}
              >
                {group.label}
                <ChevronDown
                  className="relative top-px h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
                  aria-hidden
                />
              </NavigationMenu.Trigger>

              <NavigationMenu.Content
                className={cn(
                  'absolute top-full left-0 mt-1.5',
                  'animate-in fade-in-0 zoom-in-95 data-[motion=from-end]:slide-in-from-right-52',
                  'data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52',
                  'data-[motion=to-start]:slide-out-to-left-52',
                )}
              >
                <ul
                  className={cn(
                    'min-w-[240px] rounded-lg border border-border bg-popover p-2 shadow-lg',
                    'grid gap-0.5',
                  )}
                >
                  {visibleItems.map((item) => (
                    <li key={item.url}>
                      <DropdownItem item={item} isActive={pathname === item.url} />
                    </li>
                  ))}
                </ul>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          )
        })}
      </NavigationMenu.List>

      {/* Viewport positions the dropdown content */}
      <div className="absolute left-0 top-full flex justify-start">
        <NavigationMenu.Viewport
          className={cn(
            'relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)]',
            'w-full origin-top-left overflow-hidden rounded-lg border border-border bg-popover shadow-lg',
            'transition-all duration-200',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          )}
        />
      </div>
    </NavigationMenu.Root>
  )
}
