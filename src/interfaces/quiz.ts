

// Types pour le questionnaire
export interface QuizQuestion {
    id: number
    text: string
    options: {
        id: string
        text: string
        isCorrect: boolean
    }[]
    explanation: string
}

export interface QuizConfig {
    id: string
    title: string
    theme: string
    mode: "training" | "exam"
    questionCount: number
    duration: number // en minutes
    immediateFeedback: boolean
}