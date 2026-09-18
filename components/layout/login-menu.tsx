'use client'

import { ChevronDown, LogIn, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { portalLinks, requestAccessLink } from '@/data/nav'

/** Header menu listing every client panel. Click or keyboard to open. */
export function LoginMenu() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="group">
          <LogIn aria-hidden="true" className="size-3.5" />
          Login
          <ChevronDown
            aria-hidden="true"
            className="size-3.5 opacity-70 transition-transform group-data-[state=open]:rotate-180"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Client panels</DropdownMenuLabel>
        {portalLinks.map((link) => (
          <DropdownMenuItem key={link.href} asChild>
            <a href={link.href} target="_blank" rel="noopener noreferrer" className="flex-col items-start gap-0.5">
              <span className="font-medium text-foreground">{link.label}</span>
              <span className="text-xs text-muted-foreground">{link.description}</span>
            </a>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href={requestAccessLink.href} target="_blank" rel="noopener noreferrer">
            <UserPlus aria-hidden="true" />
            <span className="flex flex-col">
              <span className="font-medium text-foreground">{requestAccessLink.label}</span>
              <span className="text-xs text-muted-foreground">{requestAccessLink.description}</span>
            </span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
