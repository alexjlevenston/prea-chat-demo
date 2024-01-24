import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { removeChat } from '@/app/actions'
import { stream } from 'undici-types'

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, previewToken } = json
  const userId = "not a user" // (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  if (previewToken) {
    openai.apiKey = previewToken
  }

  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.7,
    stream: true
  })

  const stream = OpenAIStream(res, {

    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }
      await kv.hmset(`chat:${id}`, payload)
      await kv.zadd(`user:chat:${userId}`, {
        score: createdAt,
        member: `chat:${id}`
      })
    }
  })
  const reader = stream.getReader()
  async function* streamGenerator() {
    const chunks = []
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      chunks.push(chunk)
    }
    yield chunks.join('')
  }

  const newStream = new ReadableStream({
    start(controller) {
      ;(async () => {
        for await (let chunk of streamGenerator()) {
          controller.enqueue(chunk)
        }
        controller.close()
      }
      )()
    }
  })

  return new StreamingTextResponse(newStream)
}

export async function DELETE(req: Request) {
  const json = await req.json()
  const { id, path } = json
  const userId = "not a user" // (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  const result = await removeChat({ id, path })

  if (result?.error) {
    return new Response(result.error, {
      status: 401
    })
  }

  return new Response('Chat deleted successfully', {
    status: 200
  })
}