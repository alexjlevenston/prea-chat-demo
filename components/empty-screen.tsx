import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
  {
    heading: 'What is PREA?',
    message: `What is PREA or Prison Rape Elimination Act?`
  },
  {
    heading: 'Why is PREA important?',
    message: 'What is the importance of PREA or Prison Rape Elimination Act?'
  },
  {
    heading: 'When was PREA passed?',
    message: `When was PREA passed and signed into law?`
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to PREA-Bot
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          This is an AI agent you can converse with about PREA or Prison Rape Elimination Act{' '}
          <ExternalLink href="https://www.prearesourcecenter.org/">
            (learn more about PREA)
          </ExternalLink>
        </p>
        <p className="leading-normal text-muted-foreground">
          You can ask anything about PREA below or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
