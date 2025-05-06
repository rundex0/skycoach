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
        .limit(questionCount)
        .get();

    const questions: Question[] = [];
    snapshot.forEach((doc) => questions.push(doc.data() as Question));

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
        totalScore: 0,
        duration,
        immediateFeedback,
    }

    await quizRef.set(quiz);

    console.log(`✅ Quiz ${id} ajouté avec succès`);
    
    return redirect(`/quiz/${id}`)
}