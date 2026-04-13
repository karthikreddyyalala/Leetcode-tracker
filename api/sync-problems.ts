import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = req.body as { problems?: unknown }

  if (!body || !Array.isArray(body.problems)) {
    return res.status(400).json({ error: 'Invalid payload: expected { problems: Problem[] }' })
  }

  await redis.set('lc-tracker-problems', body.problems)

  return res.status(200).json({ ok: true, synced: body.problems.length })
}
