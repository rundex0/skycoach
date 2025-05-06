"use client"

import {useCallback, useEffect, useRef, useState} from "react";
import {QuizConfig} from "@/interfaces/quiz";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock, Home, Pause, Play, XCircle} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Progress} from "@/components/ui/progress";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {useRouter} from "next/navigation";


export default function QuizScreen({quiz}: {quiz: QuizConfig}) {
    const {questions, duration, immediateFeedback, mode, id, theme} = quiz
    const router = useRouter()
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
    const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, boolean>>({})
    const [showExplanation, setShowExplanation] = useState(false)
    const [timeRemaining, setTimeRemaining] = useState(duration * 60) // en secondes
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


    // Terminer le quiz et calculer les résultats
    const finishQuiz = useCallback(() => {
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
        const timeTaken = duration * 60 - timeRemaining

        setResults({
            correctAnswers: correctCount,
            incorrectAnswers: incorrectCount,
            score,
            timeTaken,
        })

        setQuizCompleted(true)
    }, [questions, duration, selectedAnswers, timeRemaining])

    // Initialisation du quiz
    useEffect(() => {
        // Dans une application réelle, on chargerait les données du quiz depuis une API
        // en utilisant l'ID du quiz passé dans les paramètres de l'URL
        console.log("Quiz ID:", id)

        // Démarrer le timer
        if (duration > 0 && !isPaused) {
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
    }, [id, duration, quizCompleted, isPaused, finishQuiz])

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
        if (quizCompleted || (showExplanation && immediateFeedback) || isPaused) {
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
        if (immediateFeedback) {
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
            setShowExplanation(immediateFeedback && !!selectedAnswers[questions[currentQuestionIndex - 1].id])
        }
    }

    // Mettre en pause ou reprendre le quiz
    const togglePause = () => {
        setIsPaused((prev) => !prev)

        // Si on reprend le quiz, redémarrer le timer
        if (isPaused && timerRef.current === null && duration > 0) {
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
                        <CardDescription>{theme}</CardDescription>
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
                            <CardTitle>{theme}</CardTitle>
                            <CardDescription>
                                Question {currentQuestionIndex + 1} sur {questions.length}
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            {mode === "training" && (
                                <Button variant="outline" size="sm" onClick={togglePause} className="flex items-center gap-1">
                                    <Pause className="h-4 w-4" />
                                    Pause
                                </Button>
                            )}
                            {duration > 0 && (
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
                                    const showResult = showExplanation && immediateFeedback

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
                                disabled={!selectedAnswers[currentQuestion.id] || (immediateFeedback && !showExplanation)}
                            >
                                Suivant
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                onClick={finishQuiz}
                                disabled={!selectedAnswers[currentQuestion.id] || (immediateFeedback && !showExplanation)}
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