import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const problems = (await redis.get<unknown[]>('lc-tracker-problems')) ?? []
  return res.status(200).json({ problems })
}
