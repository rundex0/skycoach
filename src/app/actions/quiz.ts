"use server"

export async function createQuiz(_: undefined, formData: FormData) {
    const questionCount = parseInt(formData.get('questionCount') as string)
    const duration = parseInt(formData.get('duration') as string)
    const immediateFeedback = Boolean(formData.get('immediateFeedback') as string)
    const selectedTheme = formData.get('selectedTheme') as string

    console.log(questionCount, duration, immediateFeedback, selectedTheme)

    await new Promise(resolve => setTimeout(resolve, 5000))
    return undefined
}