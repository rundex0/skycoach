import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {useEffect, useMemo, useState} from "react";
import {Brain, CheckCircle, Database, FileCheck} from "lucide-react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";

// Étapes de création du questionnaire
const creationSteps = [
    {
        id: "preparing",
        label: "Préparation du questionnaire",
        description: "Initialisation des paramètres...",
        icon: Database,
        duration: 1000,
    },
    {
        id: "generating",
        label: "Génération des questions",
        description: "Sélection des questions adaptées à votre niveau...",
        icon: Brain,
        duration: 5000,
    },
    {
        id: "finalizing",
        label: "Finalisation",
        description: "Mise en forme du questionnaire...",
        icon: FileCheck,
        duration: 1000,
    },
]

export default function QuizPreparationScreen() {
    const router = useRouter()
    const selectedTheme = 'navigation'

    const quizId = `${selectedTheme}-${Date.now()}`


    // États pour le loader
    const [currentStep, setCurrentStep] = useState(0)
    const [progress, setProgress] = useState(0)
    const [isDone, setIsDone] = useState(false)
    const interval = 50 // Mise à jour toutes les 50ms


    useEffect(() => {
        const stepDuration =  creationSteps[currentStep].duration
        let i = 0

        const timer = setInterval(() => {
            if (isDone) return clearInterval(timer)

            const stepProgress = (i / stepDuration) * 100
            i += interval
            if(stepProgress >= 100) {
                if (currentStep + 1 < creationSteps.length) setCurrentStep(currentStep + 1)
                if (currentStep + 1 === creationSteps.length) clearInterval(timer)
            }


        }, interval)

        return () => timer && clearInterval(timer)
    }, [currentStep, isDone])

    useEffect(() => {
        const totalDuration = creationSteps.reduce((acc, step) => acc + step.duration, 0)
        let i = 0

        const timer = setInterval(() => {
            if (isDone) return clearInterval(timer)

            const progress =  (i / totalDuration) * 100
            i += interval
            setProgress(progress)

            if(progress >= 100) clearInterval(timer)
        }, interval)


        return () =>  timer && clearInterval(timer)
    }, [isDone])

    return (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
            <Card className="w-full max-w-md mx-4">
                <CardHeader>
                    <CardTitle>Création du questionnaire</CardTitle>
                    <CardDescription>Veuillez patienter pendant que nous préparons votre questionnaire...</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Progress value={isDone ? 100 : progress} className="h-2" />

                    <div className="space-y-4">
                        {creationSteps.map((step, index) => {
                            const isActive = index === currentStep && progress < 100 && !isDone
                            const isCompleted = index < currentStep || progress >= 100 || isDone

                            return (
                                <div
                                    key={step.id}
                                    className={`flex items-start space-x-4 p-3 rounded-md transition-colors ${
                                        isActive ? "bg-blue-50" : isCompleted ? "bg-green-50" : "bg-gray-50"
                                    }`}
                                >
                                    <div
                                        className={`rounded-full p-2 ${
                                            isActive
                                                ? "bg-blue-100 text-blue-600"
                                                : isCompleted
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-gray-200 text-gray-500"
                                        }`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle className="h-5 w-5" />
                                        ) : isActive ? (
                                            <step.icon className="h-5 w-5 animate-pulse" />
                                        ) : (
                                            <step.icon className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div>
                                        <p
                                            className={`font-medium ${
                                                isActive ? "text-blue-800" : isCompleted ? "text-green-800" : "text-gray-500"
                                            }`}
                                        >
                                            {step.label}
                                        </p>
                                        <p
                                            className={`text-sm ${
                                                isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-400"
                                            }`}
                                        >
                                            {isCompleted ? "Terminé" : isActive ? step.description : "En attente..."}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}