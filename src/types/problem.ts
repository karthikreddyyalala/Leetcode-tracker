export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type Problem = {
  id: string
  title: string
  url: string
  difficulty: Difficulty
  dateSolved: string
  reviewDates: string[]
  nextReview: string
}
