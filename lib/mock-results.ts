export type MockQuizAttempt = {
  id: string
  quizId: number
  quizTitle: string
  submittedAt: string
  earnedMarks: number
  totalMarks: number
  percentage: number
  passed: boolean
  answers: Record<number, number>
}

const STORAGE_KEY = 'adigun-mock-quiz-attempts'

export function getMockAttempts(): MockQuizAttempt[] {
  if (typeof window === 'undefined') return []
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function saveMockAttempt(attempt: Omit<MockQuizAttempt, 'id' | 'submittedAt'>) {
  if (typeof window === 'undefined') return null
  const next: MockQuizAttempt = {
    ...attempt,
    id: `${attempt.quizId}-${Date.now()}`,
    submittedAt: new Date().toISOString(),
  }
  const attempts = [next, ...getMockAttempts()]
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts))
  return next
}

export function calculateMockResult(quiz: { questions: { correct: number; marks: number }[]; passMark: number }, answers: Record<number, number>) {
  const totalMarks = quiz.questions.reduce((total, question) => total + question.marks, 0)
  const earnedMarks = quiz.questions.reduce((total, question, index) => total + (answers[index] === question.correct ? question.marks : 0), 0)
  const percentage = totalMarks ? Math.round((earnedMarks / totalMarks) * 100) : 0
  return { earnedMarks, totalMarks, percentage, passed: percentage >= quiz.passMark }
}
