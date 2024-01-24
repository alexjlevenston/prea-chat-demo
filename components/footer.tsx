import React from 'react'

import { cn } from '@/lib/utils'
import { ExternalLink } from '@/components/external-link'

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className
      )}
      {...props}
    >
      PREA-Bot is finetuned on the Prison Rape Elimination Act and Relevant Data.{' '}
      To learn more, please visit: {' '}
      <ExternalLink href="https://www.prearesourcecenter.org/">
        PREA Resource Center
      </ExternalLink>
      .
    </p>
  )
}
