import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const raw = await redis.get<string>('lc-tracker-problems')
  const problems = raw ? (JSON.parse(raw) as unknown[]) : []
  return res.status(200).json({ problems })
}
