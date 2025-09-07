'use client'

import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Coins, Plus } from 'lucide-react'
import Link from 'next/link'

export function TokenBalance() {
  const { data: session, update } = useSession()
  const tokens = session?.user?.tokens || 0

  const getTokenColor = (tokenCount: number) => {
    if (tokenCount >= 20) return 'bg-green-100 text-green-800 border-green-200'
    if (tokenCount >= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  return (
    <div className="flex items-center space-x-3">
      <Badge 
        variant="outline" 
        className={`${getTokenColor(tokens)} flex items-center space-x-1`}
      >
        <Coins className="h-3 w-3" />
        <span className="font-medium">{tokens} tokens</span>
      </Badge>
      
      {tokens < 10 && (
        <Link href="/app/account">
          <Button size="sm" variant="outline" className="hidden sm:flex">
            <Plus className="h-3 w-3 mr-1" />
            Buy Tokens
          </Button>
        </Link>
      )}
    </div>
  )
}