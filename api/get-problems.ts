import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: (process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL)!,
  token: (process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN)!,
})

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const raw = await redis.get('lc-tracker-problems')

  let problems: unknown[] = []
  if (Array.isArray(raw)) {
    problems = raw
  } else if (typeof raw === 'string') {
    try {
      const parsed: unknown = JSON.parse(raw)
      problems = Array.isArray(parsed) ? parsed : []
    } catch {
      problems = []
    }
  }

  return res.status(200).json({ problems })
}
