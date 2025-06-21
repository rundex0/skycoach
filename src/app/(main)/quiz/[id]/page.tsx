"use server"

import {QuizConfig} from "@/interfaces/quiz";
import QuizScreen from "@/app/(main)/quiz/[id]/_components/QuizScreen";
import {adminDb} from "@/lib/firebase/firebase-admin";
import {verifySession} from "@/lib/session";

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params
    const { uid } = await verifySession()

    try {
        const docRef = adminDb()
            .collection("quiz")
            .doc(uid)
            .collection("quizzes")
            .doc(id);

        const doc = await docRef.get();
        const quiz = doc.exists ? (doc.data() as QuizConfig) : null;


        return quiz ? <QuizScreen quiz={{...quiz, date: new Date(quiz.date)}} /> : null
    } catch (error) {
        console.error("❌ Erreur lors de la récupération du quiz :", error);
        throw error;
    }
}
