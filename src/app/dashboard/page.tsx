"use client"

import { useState } from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {
    BookOpen,
    CheckCircle,
    Clock,
    Award,
    TrendingUp,
    AlertCircle,
    CloudSun,
    Plane,
    Radio,
    LineChart
} from "lucide-react"
import {Progress} from "@/components/ui/progress";
import {Button} from "@/components/ui/button";
import Link from "next/link";



// Données factices pour la démonstration
const progressData = [
    { date: "01/05", navigation: 65, meteorologie: 70, reglementation: 80 },
    { date: "08/05", navigation: 70, meteorologie: 75, reglementation: 75 },
    { date: "15/05", navigation: 75, meteorologie: 80, reglementation: 85 },
    { date: "22/05", navigation: 80, meteorologie: 85, reglementation: 80 },
    { date: "29/05", navigation: 85, meteorologie: 90, reglementation: 90 },
]

const recentQuizzes = [
    { date: "29/05/2023", branch: "Navigation", score: 85, totalQuestions: 20 },
    { date: "27/05/2023", branch: "Météorologie", score: 90, totalQuestions: 15 },
    { date: "25/05/2023", branch: "Réglementation", score: 75, totalQuestions: 25 },
    { date: "22/05/2023", branch: "Connaissances aéronef", score: 80, totalQuestions: 18 },
]

const branches = [
    {
        name: "Navigation",
        href: "/navigation",
        progress: 75,
        icon: TrendingUp,
        color: "bg-blue-500",
        description: "Cartes, routes, calculs de navigation",
    },
    {
        name: "Météorologie",
        href: "/meteorologie",
        progress: 90,
        icon: CloudSun,
        color: "bg-cyan-500",
        description: "Phénomènes météo, interprétation des cartes",
    },
    {
        name: "Réglementation",
        href: "/reglementation",
        progress: 60,
        icon: BookOpen,
        color: "bg-amber-500",
        description: "Règles de l'air, espaces aériens",
    },
    {
        name: "Connaissances aéronef",
        href: "/aeronef",
        progress: 80,
        icon: Plane,
        color: "bg-red-500",
        description: "Systèmes, performances, limitations",
    },
    {
        name: "Performance humaine",
        href: "/performance",
        progress: 65,
        icon: LineChart,
        color: "bg-green-500",
        description: "Facteurs humains, physiologie",
    },
    {
        name: "Communications",
        href: "/communications",
        progress: 70,
        icon: Radio,
        color: "bg-purple-500",
        description: "Phraséologie, procédures radio",
    },
]

export default function DashboardPage() {
    const [stats] = useState({
        totalQuestions: 350,
        correctAnswers: 280,
        incorrectAnswers: 70,
        completionRate: 80,
        studyTime: 42,
        streak: 7,
    })
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            {/* Statistiques globales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Questions répondues</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalQuestions}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.correctAnswers} correctes ({Math.round((stats.correctAnswers / stats.totalQuestions) * 100)}%)
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taux de complétion</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completionRate}%</div>
                        <Progress value={stats.completionRate} className="h-2" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Temps d&#39;étude</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.studyTime}h</div>
                        <p className="text-xs text-muted-foreground">Cette semaine</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Série actuelle</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.streak} jours</div>
                        <p className="text-xs text-muted-foreground">Continuez comme ça !</p>
                    </CardContent>
                </Card>
            </div>

            {/* Branches et questionnaires récents */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Branches à réviser</CardTitle>
                            <CardDescription>Sélectionnez une branche pour commencer la révision</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {branches.map((branch) => (
                                    <Card key={branch.name} className="overflow-hidden py-0">
                                        <div className={`h-1 ${branch.color}`} />
                                        <CardHeader className="p-4">
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="text-lg">{branch.name}</CardTitle>
                                                <branch.icon className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <CardDescription>{branch.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0">
                                            <div className="flex items-center space-x-2">
                                                <Progress value={branch.progress} className="h-2" />
                                                <span className="text-sm font-medium">{branch.progress}%</span>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0">
                                            <Link href={branch.href} className="w-full">
                                                <Button variant="outline" className="w-full">
                                                    Réviser
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Questionnaires récents</CardTitle>
                            <CardDescription>Vos dernières sessions de révision</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentQuizzes.map((quiz, index) => (
                                    <Card key={index}>
                                        <CardHeader className="p-3">
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="text-sm">{quiz.branch}</CardTitle>
                                                <span className="text-xs text-muted-foreground">{quiz.date}</span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-3 pt-0">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center space-x-2">
                                                    {quiz.score >= 80 ? (
                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <AlertCircle className="h-4 w-4 text-amber-500" />
                                                    )}
                                                    <span className="text-sm">
                            {quiz.score}% ({Math.round((quiz.score * quiz.totalQuestions) / 100)}/{quiz.totalQuestions})
                          </span>
                                                </div>
                                                <Button variant="ghost" size="sm">
                                                    Détails
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">
                                Voir tout l&#39;historique
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}


