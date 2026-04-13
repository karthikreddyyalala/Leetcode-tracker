import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { Resend } from 'resend'

const redis = Redis.fromEnv()

type Difficulty = 'Easy' | 'Medium' | 'Hard'

type Problem = {
  id: string
  title: string
  url: string
  difficulty: Difficulty
  dateSolved: string
  reviewDates: string[]
  nextReview: string
}

function todayUTC(): string {
  return new Date().toISOString().split('T')[0]
}

const difficultyColor: Record<Difficulty, string> = {
  Easy: '#34d399',
  Medium: '#fbbf24',
  Hard: '#f87171',
}

function buildEmailHtml(due: Problem[]): string {
  const count = due.length
  const problemRows = due
    .map(
      (p) => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #27272a;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">
          <span style="
            display:inline-block;
            background:transparent;
            border:1px solid ${difficultyColor[p.difficulty]}40;
            color:${difficultyColor[p.difficulty]};
            font-size:10px;
            font-weight:600;
            letter-spacing:0.06em;
            text-transform:uppercase;
            padding:2px 7px;
            border-radius:4px;
            font-family:'Courier New',monospace;
          ">${p.difficulty}</span>
        </div>
        <a href="${p.url}" style="
          color:#f4f4f5;
          font-size:15px;
          font-weight:500;
          text-decoration:none;
          letter-spacing:-0.01em;
        ">${p.title}</a>
        <div style="margin-top:5px;">
          <a href="${p.url}" style="
            color:#0ea5e9;
            font-size:12px;
            text-decoration:none;
          ">${p.url}</a>
        </div>
      </td>
    </tr>`,
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>LC Tracker — Review Reminder</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px 40px;">

    <div style="margin-bottom:28px;">
      <span style="
        display:inline-block;
        background:#0ea5e9;
        color:#09090b;
        font-size:10px;
        font-weight:700;
        letter-spacing:0.1em;
        text-transform:uppercase;
        padding:4px 10px;
        border-radius:5px;
      ">Review Day</span>
    </div>

    <h1 style="
      color:#f4f4f5;
      font-size:26px;
      font-weight:600;
      letter-spacing:-0.03em;
      line-height:1.2;
      margin:0 0 10px;
    ">
      ${count} problem${count !== 1 ? 's' : ''} waiting for you today, Karthik
    </h1>

    <p style="
      color:#71717a;
      font-size:14px;
      line-height:1.6;
      margin:0 0 36px;
    ">
      You logged ${count === 1 ? 'this' : 'these'} 7 days ago. Time to lock ${count === 1 ? 'it' : 'them'} in.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #27272a;">
      <tbody>
        ${problemRows}
      </tbody>
    </table>

    <div style="margin-top:36px;">
      <a href="https://leetcode.com" style="
        display:inline-block;
        background:#0ea5e9;
        color:#09090b;
        font-size:13px;
        font-weight:600;
        text-decoration:none;
        padding:10px 22px;
        border-radius:8px;
      ">Open LeetCode</a>
    </div>

    <p style="
      color:#3f3f46;
      font-size:12px;
      margin-top:48px;
      line-height:1.5;
    ">
      LC Tracker &mdash; your personal spaced repetition system.<br />
      This reminder was triggered because you have problems due today.
    </p>

  </div>
</body>
</html>`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const secret = req.headers['x-cron-secret']
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const problems: Problem[] = (await redis.get<Problem[]>('lc-tracker-problems')) ?? []
  const due = problems.filter((p) => p.nextReview === todayUTC())

  if (due.length === 0) {
    return res.status(200).json({ sent: false, reason: 'No problems due today' })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  const { error } = await resend.emails.send({
    from: 'LC Tracker <onboarding@resend.dev>',
    to: process.env.REMINDER_EMAIL!,
    subject: `💪 ${due.length} problem${due.length !== 1 ? 's' : ''} waiting for you today, Karthik`,
    html: buildEmailHtml(due),
  })

  if (error) {
    console.error('Resend error:', error)
    return res.status(500).json({ sent: false, error: error.message })
  }

  return res.status(200).json({ sent: true, count: due.length })
}
