"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CheckCircle2, XCircle, Clock, ArrowLeft, ArrowRight, Home, BookOpen, Pause, Play } from "lucide-react"
import {QuizConfig, QuizQuestion} from "@/interfaces/quiz";
import QuizPreparationScreen from "@/app/(main)/quiz/_components/QuizPreparationScreen";


// Données factices pour le questionnaire
const mockQuizConfig: QuizConfig = {
    id: "nav-123",
    title: "Navigation - Questionnaire d'entraînement",
    theme: "navigation",
    mode: "training",
    questionCount: 10,
    duration: 15,
    immediateFeedback: true,
}

const mockQuestions: QuizQuestion[] = [
    {
        id: 1,
        text: "Quelle est la différence entre le cap magnétique et le cap vrai ?",
        options: [
            { id: "a", text: "Le cap magnétique tient compte de la déclinaison magnétique", isCorrect: true },
            { id: "b", text: "Le cap vrai est toujours plus grand que le cap magnétique", isCorrect: false },
            { id: "c", text: "Le cap magnétique est mesuré par rapport au nord géographique", isCorrect: false },
            { id: "d", text: "Il n'y a aucune différence entre les deux", isCorrect: false },
        ],
        explanation:
            "Le cap magnétique est mesuré par rapport au nord magnétique, tandis que le cap vrai est mesuré par rapport au nord géographique. La différence entre les deux est la déclinaison magnétique, qui varie selon la position géographique.",
    },
    {
        id: 2,
        text: "Comment calcule-t-on la distance orthodromique entre deux points ?",
        options: [
            { id: "a", text: "En utilisant la formule de Pythagore", isCorrect: false },
            { id: "b", text: "En mesurant la distance sur une carte Mercator", isCorrect: false },
            { id: "c", text: "En utilisant la formule de la distance du grand cercle", isCorrect: true },
            { id: "d", text: "En additionnant les distances entre les parallèles et les méridiens", isCorrect: false },
        ],
        explanation:
            "La distance orthodromique (ou distance du grand cercle) est la distance la plus courte entre deux points sur une sphère. Elle est calculée en utilisant la formule du grand cercle qui prend en compte la courbure de la Terre.",
    },
    {
        id: 3,
        text: "Qu'est-ce que la dérive due au vent ?",
        options: [
            { id: "a", text: "L'angle entre le cap et la route suivie par l'avion", isCorrect: true },
            { id: "b", text: "La variation de la vitesse de l'avion due au vent", isCorrect: false },
            { id: "c", text: "L'erreur de navigation causée par les turbulences", isCorrect: false },
            { id: "d", text: "Le changement d'altitude causé par les courants ascendants", isCorrect: false },
        ],
        explanation:
            "La dérive est l'angle entre l'axe longitudinal de l'avion (le cap) et la trajectoire réelle suivie par l'avion par rapport au sol. Elle est causée par le vent qui pousse l'avion latéralement.",
    },
    {
        id: 4,
        text: "Quelle est la signification d'une ligne isogone sur une carte aéronautique ?",
        options: [
            { id: "a", text: "Une ligne reliant des points de même altitude", isCorrect: false },
            { id: "b", text: "Une ligne reliant des points de même pression atmosphérique", isCorrect: false },
            { id: "c", text: "Une ligne reliant des points de même déclinaison magnétique", isCorrect: true },
            { id: "d", text: "Une ligne reliant des points de même température", isCorrect: false },
        ],
        explanation:
            "Une ligne isogone est une ligne sur une carte qui relie tous les points ayant la même déclinaison magnétique, c'est-à-dire la même différence angulaire entre le nord magnétique et le nord géographique.",
    },
    {
        id: 5,
        text: "Comment calcule-t-on la vitesse sol (GS) ?",
        options: [
            { id: "a", text: "GS = TAS + composante du vent", isCorrect: true },
            { id: "b", text: "GS = IAS corrigée de la densité de l'air", isCorrect: false },
            { id: "c", text: "GS = TAS × facteur de correction barométrique", isCorrect: false },
            { id: "d", text: "GS = IAS + altitude-pression", isCorrect: false },
        ],
        explanation:
            "La vitesse sol (Ground Speed - GS) est la vitesse réelle de l'avion par rapport au sol. Elle est égale à la vitesse propre (True Air Speed - TAS) plus ou moins la composante du vent dans l'axe de déplacement de l'avion.",
    },
    {
        id: 6,
        text: "Qu'est-ce que le triangle des vitesses en navigation aérienne ?",
        options: [
            { id: "a", text: "Un instrument de navigation", isCorrect: false },
            { id: "b", text: "Une représentation graphique des forces agissant sur l'avion", isCorrect: false },
            { id: "c", text: "Une méthode de calcul de la consommation de carburant", isCorrect: false },
            { id: "d", text: "Une représentation vectorielle du cap, de la route et du vent", isCorrect: true },
        ],
        explanation:
            "Le triangle des vitesses est une représentation vectorielle qui permet de déterminer graphiquement la relation entre le cap de l'avion, sa vitesse propre, le vent (direction et vitesse) et la route résultante avec la vitesse sol.",
    },
    {
        id: 7,
        text: "Quelle est la différence entre la route vraie et la route magnétique ?",
        options: [
            {
                id: "a",
                text: "La route vraie est mesurée par rapport au nord géographique, la route magnétique par rapport au nord magnétique",
                isCorrect: true,
            },
            { id: "b", text: "La route vraie tient compte du vent, la route magnétique non", isCorrect: false },
            {
                id: "c",
                text: "La route vraie est la route planifiée, la route magnétique est la route réellement suivie",
                isCorrect: false,
            },
            { id: "d", text: "Il n'y a pas de différence, ce sont deux termes pour le même concept", isCorrect: false },
        ],
        explanation:
            "La route vraie est l'angle entre la trajectoire de l'avion et le nord géographique, tandis que la route magnétique est l'angle entre la trajectoire de l'avion et le nord magnétique. La différence entre les deux est la déclinaison magnétique.",
    },
    {
        id: 8,
        text: "Comment détermine-t-on l'heure estimée d'arrivée (ETA) ?",
        options: [
            { id: "a", text: "En divisant la distance par la vitesse indiquée (IAS)", isCorrect: false },
            { id: "b", text: "En divisant la distance par la vitesse sol (GS)", isCorrect: true },
            { id: "c", text: "En multipliant la distance par la vitesse propre (TAS)", isCorrect: false },
            { id: "d", text: "En ajoutant la durée du vol à l'heure de départ prévue", isCorrect: false },
        ],
        explanation:
            "L'heure estimée d'arrivée (Estimated Time of Arrival - ETA) est calculée en divisant la distance restante par la vitesse sol (GS) pour obtenir le temps de vol restant, puis en ajoutant ce temps à l'heure actuelle.",
    },
    {
        id: 9,
        text: "Qu'est-ce que la navigation à l'estime ?",
        options: [
            { id: "a", text: "Une méthode de navigation basée uniquement sur les instruments de bord", isCorrect: false },
            { id: "b", text: "Une méthode de navigation utilisant les repères visuels au sol", isCorrect: false },
            {
                id: "c",
                text: "Une méthode de navigation basée sur le calcul du cap, de la vitesse et du temps écoulé",
                isCorrect: true,
            },
            { id: "d", text: "Une méthode de navigation utilisant exclusivement le GPS", isCorrect: false },
        ],
        explanation:
            "La navigation à l'estime est une méthode de navigation qui consiste à déterminer sa position en calculant le déplacement effectué à partir d'une position connue, en tenant compte du cap suivi, de la vitesse et du temps écoulé, ainsi que de l'effet du vent.",
    },
    {
        id: 10,
        text: "Quelle est la différence entre un VOR et un NDB ?",
        options: [
            {
                id: "a",
                text: "Le VOR fournit une information de distance, le NDB une information de direction",
                isCorrect: false,
            },
            { id: "b", text: "Le VOR fournit un radial magnétique, le NDB un relèvement magnétique", isCorrect: true },
            {
                id: "c",
                text: "Le VOR est utilisé pour les approches de précision, le NDB pour la navigation en route",
                isCorrect: false,
            },
            { id: "d", text: "Le VOR fonctionne en basse fréquence, le NDB en très haute fréquence", isCorrect: false },
        ],
        explanation:
            "Le VOR (VHF Omnidirectional Range) fournit un radial magnétique (ligne de position depuis la station), tandis que le NDB (Non-Directional Beacon) fournit un relèvement magnétique (direction vers la station). De plus, le VOR fonctionne en VHF et est plus précis que le NDB qui fonctionne en basse ou moyenne fréquence.",
    },
]

export default function QuizPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [quizConfig, setQuizConfig] = useState<QuizConfig>(mockQuizConfig)
    const [questions, setQuestions] = useState<QuizQuestion[]>(mockQuestions)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
    const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, boolean>>({})
    const [showExplanation, setShowExplanation] = useState(false)
    const [timeRemaining, setTimeRemaining] = useState(quizConfig.duration * 60) // en secondes
    const [quizCompleted, setQuizCompleted] = useState(false)
    const [isPaused, setIsPaused] = useState(false) // Nouvel état pour la pause
    const [results, setResults] = useState<{
        correctAnswers: number
        incorrectAnswers: number
        score: number
        timeTaken: number
    } | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const timerRef = useRef<NodeJS.Timeout | null>(null)

    // Initialisation du quiz
    useEffect(() => {
        // Dans une application réelle, on chargerait les données du quiz depuis une API
        // en utilisant l'ID du quiz passé dans les paramètres de l'URL
        console.log("Quiz ID:", params.id)

        // Démarrer le timer
        if (quizConfig.duration > 0 && !isPaused) {
            timerRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        // Temps écoulé, terminer le quiz
                        clearInterval(timerRef.current as NodeJS.Timeout)
                        if (!quizCompleted) {
                            finishQuiz()
                        }
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }

        // Nettoyage du timer à la destruction du composant
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }, [params.id, quizConfig.duration, quizCompleted, isPaused])

    // Formater le temps restant
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
    }

    // Obtenir la question actuelle
    const currentQuestion = questions[currentQuestionIndex]

    // Gérer la sélection d'une réponse
    const handleAnswerSelect = (answerId: string) => {
        if (quizCompleted || (showExplanation && quizConfig.immediateFeedback) || isPaused) {
            return // Empêcher de changer la réponse après avoir vu l'explication ou en pause
        }

        setSelectedAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: answerId,
        }))

        setAnsweredQuestions((prev) => ({
            ...prev,
            [currentQuestion.id]: true,
        }))

        // Si le feedback immédiat est activé, montrer l'explication
        if (quizConfig.immediateFeedback) {
            setShowExplanation(true)
        }
    }

    // Passer à la question suivante
    const goToNextQuestion = () => {
        if (isPaused) return // Ne pas permettre de naviguer en pause

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
            setShowExplanation(false)
        } else if (!quizCompleted) {
            // C'était la dernière question, terminer le quiz
            finishQuiz()
        }
    }

    // Revenir à la question précédente
    const goToPreviousQuestion = () => {
        if (isPaused) return // Ne pas permettre de naviguer en pause

        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1)
            setShowExplanation(quizConfig.immediateFeedback && !!selectedAnswers[questions[currentQuestionIndex - 1].id])
        }
    }

    // Mettre en pause ou reprendre le quiz
    const togglePause = () => {
        setIsPaused((prev) => !prev)

        // Si on reprend le quiz, redémarrer le timer
        if (isPaused && timerRef.current === null && quizConfig.duration > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current as NodeJS.Timeout)
                        if (!quizCompleted) {
                            finishQuiz()
                        }
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        // Si on met en pause, arrêter le timer
        else if (!isPaused && timerRef.current !== null) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
    }

    // Terminer le quiz et calculer les résultats
    const finishQuiz = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }

        let correctCount = 0
        let incorrectCount = 0

        // Calculer le nombre de réponses correctes et incorrectes
        Object.entries(selectedAnswers).forEach(([questionId, answerId]) => {
            const question = questions.find((q) => q.id === Number.parseInt(questionId))
            if (question) {
                const selectedOption = question.options.find((opt) => opt.id === answerId)
                if (selectedOption?.isCorrect) {
                    correctCount++
                } else {
                    incorrectCount++
                }
            }
        })

        // Calculer le score en pourcentage
        const score = Math.round((correctCount / questions.length) * 100)

        // Calculer le temps pris
        const timeTaken = quizConfig.duration * 60 - timeRemaining

        setResults({
            correctAnswers: correctCount,
            incorrectAnswers: incorrectCount,
            score,
            timeTaken,
        })

        setQuizCompleted(true)
    }

    // Vérifier si la réponse sélectionnée est correcte
    const isAnswerCorrect = (questionId: number, answerId: string) => {
        const question = questions.find((q) => q.id === questionId)
        if (!question) return false
        const option = question.options.find((opt) => opt.id === answerId)
        return option?.isCorrect || false
    }

    // Calculer la progression du quiz
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100

    // Afficher les résultats du quiz
    if (quizCompleted && results) {
        return (
            <div className="container max-w-4xl mx-auto py-8">
                <Card className="shadow-lg pt-0 pb-6 overflow-hidden">
                    <CardHeader className="bg-slate-50 py-6">
                        <CardTitle className="text-2xl">Résultats du questionnaire</CardTitle>
                        <CardDescription>{quizConfig.title}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="text-5xl font-bold mb-2">{results.score}%</div>
                                <p className="text-muted-foreground">
                                    {results.score >= 75 ? "Félicitations !" : "Continuez à vous entraîner !"}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Réponses correctes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-green-600">
                                            {results.correctAnswers} / {questions.length}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Réponses incorrectes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-red-600">
                                            {results.incorrectAnswers} / {questions.length}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Temps utilisé</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {Math.floor(results.timeTaken / 60)}:{(results.timeTaken % 60).toString().padStart(2, "0")}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Révision des questions</h3>
                                <div className="space-y-4">
                                    {questions.map((question, index) => {
                                        const selectedAnswer = selectedAnswers[question.id]
                                        const isCorrect = selectedAnswer ? isAnswerCorrect(question.id, selectedAnswer) : false
                                        const hasAnswered = !!selectedAnswer

                                        return (
                                            <Card
                                                key={question.id}
                                                className={`border-l-4 ${isCorrect ? "border-l-green-500" : hasAnswered ? "border-l-red-500" : "border-l-gray-300"}`}
                                            >
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-base">
                                                        Question {index + 1}: {question.text}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    <div className="space-y-2">
                                                        {question.options.map((option) => {
                                                            const isSelected = selectedAnswer === option.id
                                                            let optionClass = ""

                                                            if (isSelected && option.isCorrect) {
                                                                optionClass = "bg-green-50 border-green-200 text-green-800"
                                                            } else if (isSelected && !option.isCorrect) {
                                                                optionClass = "bg-red-50 border-red-200 text-red-800"
                                                            } else if (!isSelected && option.isCorrect) {
                                                                optionClass = "bg-green-50 border-green-200 text-green-800"
                                                            }

                                                            return (
                                                                <div
                                                                    key={option.id}
                                                                    className={`p-3 rounded-md border ${optionClass} ${isSelected ? "font-medium" : ""}`}
                                                                >
                                                                    <div className="flex items-center">
                                                                        <div className="mr-2">{option.id.toUpperCase()}.</div>
                                                                        <div>{option.text}</div>
                                                                        {isSelected && option.isCorrect && (
                                                                            <CheckCircle2 className="ml-auto h-5 w-5 text-green-600" />
                                                                        )}
                                                                        {isSelected && !option.isCorrect && (
                                                                            <XCircle className="ml-auto h-5 w-5 text-red-600" />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                    {hasAnswered && (
                                                        <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md text-blue-800">
                                                            <p className="font-medium">Explication :</p>
                                                            <p>{question.explanation}</p>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => router.push("/quiz")}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour aux questionnaires
                        </Button>
                        <Button onClick={() => router.push("/dashboard")}>
                            <Home className="mr-2 h-4 w-4" />
                            Retour au tableau de bord
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    // Écran de pause
    if (isPaused) {
        return (
            <div className="container max-w-4xl mx-auto py-8">
                <Card className="shadow-lg py-0 overflow-hidden pb-6">
                    <CardHeader className="bg-slate-50 text-center py-6">
                        <CardTitle className="text-2xl">Quiz en pause</CardTitle>
                        <CardDescription>Prenez votre temps, le chronomètre est arrêté</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 text-center">
                        <div className="space-y-8 py-8">
                            <div className="text-5xl font-bold mb-2">{formatTime(timeRemaining)}</div>
                            <p className="text-muted-foreground">
                                Question {currentQuestionIndex + 1} sur {questions.length}
                            </p>
                            <Button size="lg" onClick={togglePause} className="mt-4">
                                <Play className="mr-2 h-5 w-5" />
                                Reprendre le questionnaire
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">Quitter le questionnaire</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Êtes-vous sûr de vouloir quitter ?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Votre progression ne sera pas sauvegardée si vous quittez maintenant.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <Button onClick={() => router.push("/quiz")}>Quitter</Button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="container max-w-4xl mx-auto py-8">
            <Card className="shadow-lg py-0 overflow-hidden">
                <CardHeader className="bg-slate-50 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>{quizConfig.title}</CardTitle>
                            <CardDescription>
                                Question {currentQuestionIndex + 1} sur {questions.length}
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            {quizConfig.mode === "training" && (
                                <Button variant="outline" size="sm" onClick={togglePause} className="flex items-center gap-1">
                                    <Pause className="h-4 w-4" />
                                    Pause
                                </Button>
                            )}
                            {quizConfig.duration > 0 && (
                                <div className="flex items-center bg-white px-3 py-1 rounded-md border">
                                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className={`font-mono ${timeRemaining < 60 ? "text-red-600 font-bold" : ""}`}>
                                        {formatTime(timeRemaining)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <Progress value={progress} className="mt-2" />
                </CardHeader>

                <CardContent className="pt-6">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">{currentQuestion.text}</h2>
                            <RadioGroup
                                value={selectedAnswers[currentQuestion.id] || ""}
                                onValueChange={handleAnswerSelect}
                                className="space-y-3"
                            >
                                {currentQuestion.options.map((option) => {
                                    const isSelected = selectedAnswers[currentQuestion.id] === option.id
                                    const showResult = showExplanation && quizConfig.immediateFeedback

                                    let optionClass = ""
                                    if (showResult) {
                                        if (isSelected && option.isCorrect) {
                                            optionClass = "bg-green-50 border-green-200"
                                        } else if (isSelected && !option.isCorrect) {
                                            optionClass = "bg-red-50 border-red-200"
                                        } else if (!isSelected && option.isCorrect) {
                                            optionClass = "bg-green-50 border-green-200"
                                        }
                                    }

                                    return (
                                        <div
                                            key={option.id}
                                            className={`flex items-center space-x-2 p-3 rounded-md border ${optionClass} hover:bg-slate-50 transition-colors`}
                                        >
                                            <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                                            <Label htmlFor={`option-${option.id}`} className="flex-grow cursor-pointer py-1">
                                                <span className="font-medium mr-2">{option.id.toUpperCase()}.</span>
                                                {option.text}
                                            </Label>
                                            {showResult && isSelected && option.isCorrect && (
                                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                            )}
                                            {showResult && isSelected && !option.isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                                        </div>
                                    )
                                })}
                            </RadioGroup>
                        </div>

                        {showExplanation && (
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
                                <div className="flex items-start">
                                    <BookOpen className="h-5 w-5 mr-2 mt-0.5 text-blue-600" />
                                    <div>
                                        <p className="font-medium text-blue-800">Explication :</p>
                                        <p className="text-blue-800">{currentQuestion.explanation}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between border-t bg-slate-50 p-4">
                    <div className="flex space-x-2">
                        <Button variant="outline" onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Précédent
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">Quitter</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Êtes-vous sûr de vouloir quitter ?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Votre progression ne sera pas sauvegardée si vous quittez maintenant.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <Button onClick={() => router.push("/quiz")}>Quitter</Button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    <div>
                        {currentQuestionIndex < questions.length - 1 ? (
                            <Button
                                onClick={goToNextQuestion}
                                disabled={!selectedAnswers[currentQuestion.id] || (quizConfig.immediateFeedback && !showExplanation)}
                            >
                                Suivant
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                onClick={finishQuiz}
                                disabled={!selectedAnswers[currentQuestion.id] || (quizConfig.immediateFeedback && !showExplanation)}
                            >
                                Terminer
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
