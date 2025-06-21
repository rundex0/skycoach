"use server"

import {adminDb} from "@/lib/firebase/firebase-admin";
import {QuizConfig, Question} from "@/interfaces/quiz";
import {redirect} from "next/navigation";
import {verifySession} from "@/lib/session";

export async function createQuiz(_: undefined, formData: FormData) {
    const questionCount = parseInt(formData.get('questionCount') as string)
    const duration = parseInt(formData.get('duration') as string)
    const immediateFeedback = Boolean(formData.get('immediateFeedback') as string)
    const selectedTheme = formData.get('selectedTheme') as string
    const mode = formData.get('mode') as "training" | "exam"

    // récupération des questions
    const snapshot = await adminDb()
        .collection("questions")
        .doc(selectedTheme)
        .collection("quizQuestions")
        .get()


    const ids = getRandomIntegersInRange(questionCount, 1, 201)

    const questions: Question[] = [];
    snapshot.forEach((doc) => {
        const question = doc.data() as Question
        if(ids.includes(question.id)) questions.push(question)
    });

    const { uid } = await verifySession()

    const quizRef = adminDb()
        .collection("quiz")
        .doc(uid)
        .collection("quizzes")
        .doc();

    const id =  quizRef.id

    const quiz: QuizConfig = {
        id,
        theme: selectedTheme,
        mode,
        questions,
        selectedAnswers: {},
        completed: false,
        score: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        timeTaken: 0,
        duration: duration * 60,
        immediateFeedback,
        date: new Date(),
    }

    await quizRef.set(quiz);

    console.log(`✅ Quiz ${id} ajouté avec succès`);
    
    return redirect(`/quiz/${id}`)
}


export async function updateQuiz(quiz: Partial<QuizConfig> & { id: string }) {
    const { uid } = await verifySession()

    const quizRef = adminDb()
        .collection("quiz")
        .doc(uid)
        .collection("quizzes")
        .doc(quiz.id)

    await quizRef.update(quiz)
}


/**
 * Tire n entiers uniques au hasard dans un intervalle [min, max]
 * @param n Le nombre d'entiers à tirer
 * @param min Valeur minimale (incluse)
 * @param max Valeur maximale (incluse)
 */
function getRandomIntegersInRange(n: number, min: number, max: number): number[] {
    const range = Array.from({ length: max - min + 1 }, (_, i) => i + min);

    // Mélange aléatoire (shuffle)
    for (let i = range.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [range[i], range[j]] = [range[j], range[i]];
    }

    return range.slice(0, n);
}