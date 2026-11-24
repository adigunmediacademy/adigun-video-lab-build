export type MockQuestion = {
  prompt: string
  options: string[]
  correct: number
  marks: number
  explanation?: string
}

export type MockQuiz = {
  id: number
  title: string
  course: string
  lesson: string
  status: 'Published' | 'Draft'
  duration: number
  passMark: number
  questions: MockQuestion[]
  instructions: string
}

export const mockQuizzes: MockQuiz[] = [
  {
    id: 1,
    title: 'Editing Fundamentals',
    course: 'Video Editing Foundations',
    lesson: 'The Editing Timeline',
    status: 'Published',
    duration: 20,
    passMark: 70,
    instructions: 'Choose the best answer for each question. You can review your answers before submitting.',
    questions: [
      { prompt: 'What does a timeline organize?', options: ['Clips and layers', 'Passwords', 'Camera batteries', 'Invoices'], correct: 0, marks: 5, explanation: 'A timeline places clips, audio and layers in sequence so the edit can be shaped over time.' },
      { prompt: 'Which edit removes an unwanted section between two clips?', options: ['A cut', 'A fade-out', 'A title card', 'A color grade'], correct: 0, marks: 5, explanation: 'A cut removes or joins footage directly; transitions and grades change presentation rather than remove the section.' },
      { prompt: 'What should you check before exporting?', options: ['The sequence and audio', 'Your inbox only', 'The keyboard color', 'The file name length'], correct: 0, marks: 5, explanation: 'A final sequence and audio check catches missing clips, timing issues and muted tracks before delivery.' },
    ],
  },
  {
    id: 2,
    title: 'Story Structure Check-in',
    course: 'Storytelling for Creators',
    lesson: 'Cuts That Tell Stories',
    status: 'Published',
    duration: 15,
    passMark: 60,
    instructions: 'Take your time and review your answers before submitting.',
    questions: [{ prompt: 'What gives a story momentum?', options: ['Conflict', 'Silence', 'A blank frame', 'File names'], correct: 0, marks: 10 }],
  },
]

export function getMockQuizzes(): MockQuiz[] {
  if (typeof window === 'undefined') return mockQuizzes
  try {
    const saved = window.localStorage.getItem('adigun-mock-quizzes')
    return saved ? JSON.parse(saved) : mockQuizzes
  } catch {
    return mockQuizzes
  }
}
