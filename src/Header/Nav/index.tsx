'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import type { NavGroup, NavItem } from '@/globals/types'
import { cn } from '@/utilities/cn'

interface NavProps {
  groups: NavGroup[]
  user?: { name?: string; approved?: boolean } | null
}

function isVisible(
  item: Pick<NavItem | NavGroup, 'requiresAuth' | 'requiresApproval'>,
  user: NavProps['user'],
): boolean {
  if (item.requiresApproval && !user?.approved) return false
  if (item.requiresAuth && !user) return false
  return true
}

function DropdownGroup({ group, pathname, user }: { group: NavGroup; pathname: string; user: NavProps['user'] }) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  const visibleItems = (group.items ?? []).filter((item) => isVisible(item, user))
  if (visibleItems.length === 0) return null

  const groupIsActive = visibleItems.some((item) => pathname === item.url)

  // Close on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
          'text-foreground/80 hover:text-foreground hover:bg-accent',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          open && 'bg-accent text-foreground',
          groupIsActive && 'text-primary',
        )}
      >
        {group.label}
        <ChevronDown
          className={cn('h-3.5 w-3.5 transition-transform duration-200', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 min-w-[240px] rounded-lg border border-border bg-popover p-2 shadow-lg">
          <ul className="grid gap-0.5 list-none m-0 p-0">
            {visibleItems.map((item) => {
              const isActive = pathname === item.url
              return (
                <li key={item.url}>
                  <Link
                    href={item.url}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex flex-col gap-0.5 rounded-md px-3 py-2.5 transition-colors',
                      'hover:bg-primary/10 focus:outline-none',
                      isActive && 'bg-primary/10 text-primary font-medium',
                    )}
                  >
                    <span className="text-sm font-medium leading-none text-foreground">
                      {item.label}
                    </span>
                    {item.description && (
                      <span className="text-xs text-muted-foreground leading-snug mt-0.5">
                        {item.description}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export function Nav({ groups, user }: NavProps) {
  const pathname = usePathname()
  const visibleGroups = groups.filter((g) => isVisible(g, user))

  return (
    <div className="flex items-center gap-1">
      {visibleGroups.map((group) => {
        if (group.type === 'link') {
          const isActive = pathname === group.url
          const isRegister = group.url === '/register'
          return (
            <Link
              key={group.label}
              href={group.url ?? '/'}
              className={cn(
                'inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                'text-foreground/80 hover:text-foreground hover:bg-accent',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isActive && 'text-primary bg-primary/10',
                isRegister && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground',
              )}
            >
              {group.label}
            </Link>
          )
        }

        return (
          <DropdownGroup key={group.label} group={group} pathname={pathname} user={user} />
        )
      })}
    </div>
  )
}
