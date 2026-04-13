import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: (process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL)!,
  token: (process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN)!,
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = req.body as { problems?: unknown }

  if (!body || !Array.isArray(body.problems)) {
    return res.status(400).json({ error: 'Invalid payload: expected { problems: Problem[] }' })
  }

  await redis.set('lc-tracker-problems', body.problems)
  console.log('[sync-problems] saved', (body.problems as unknown[]).length, 'problems to Redis')

  return res.status(200).json({ ok: true, synced: body.problems.length })
}
