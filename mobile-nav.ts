'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Template,
  Wand2,
  FolderOpen,
  User
} from 'lucide-react'

const mobileNavigation = [
  {
    name: 'Dashboard',
    href: '/app',
    icon: LayoutDashboard,
  },
  {
    name: 'Templates',
    href: '/app/templates',
    icon: Template,
  },
  {
    name: 'Generate',
    href: '/app/generate/photo',
    icon: Wand2,
  },
  {
    name: 'Library',
    href: '/app/library',
    icon: FolderOpen,
  },
  {
    name: 'Account',
    href: '/app/account',
    icon: User,
  },
]

export function MobileNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/app') {
      return pathname === href
    }
    if (href === '/app/generate/photo') {
      return pathname.startsWith('/app/generate')
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <nav className="flex">
        {mobileNavigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center py-2 text-xs",
              isActive(item.href)
                ? "text-brand-600 bg-brand-50"
                : "text-gray-600"
            )}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}