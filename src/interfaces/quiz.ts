

// Types pour le questionnaire
export interface Question {
    id: number
    text: string
    options: {
        id: string
        text: string
        isCorrect: boolean
    }[]
    explanation: string
}

export interface SelectedAnswer {
    [questionId: string]: string | null
}

export interface QuizConfig {
    id: string
    theme: string
    mode: "training" | "exam"
    questions: Question[]
    selectedAnswers: SelectedAnswer
    completed: boolean
    totalScore: number
    duration: number // en minutes
    immediateFeedback: boolean
}