"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation, CloudSun, BookOpen, Plane, LineChart, Radio, Timer, HelpCircle, CheckCircle } from "lucide-react"

// Ajouter l'import du router de Next.js en haut du fichier
//import { useRouter } from "next/navigation"
import QuizPreparationScreen from "@/app/(main)/quiz/_components/QuizPreparationScreen";

// Définition des thèmes disponibles
const themes = [
    {
        id: "navigation",
        name: "Navigation",
        description: "Cartes, routes, calculs de navigation",
        icon: Navigation,
        color: "bg-blue-500",
        hoverColor: "hover:bg-blue-50",
        selectedBg: "bg-blue-500",
        selectedText: "text-white",
    },
    {
        id: "meteorologie",
        name: "Météorologie",
        description: "Phénomènes météo, interprétation des cartes",
        icon: CloudSun,
        color: "bg-cyan-500",
        hoverColor: "hover:bg-cyan-50",
        selectedBg: "bg-cyan-500",
        selectedText: "text-white",
    },
    {
        id: "reglementation",
        name: "Réglementation",
        description: "Règles de l'air, espaces aériens",
        icon: BookOpen,
        color: "bg-amber-500",
        hoverColor: "hover:bg-amber-50",
        selectedBg: "bg-amber-500",
        selectedText: "text-white",
    },
    {
        id: "aeronef",
        name: "Connaissances aéronef",
        description: "Systèmes, performances, limitations",
        icon: Plane,
        color: "bg-red-500",
        hoverColor: "hover:bg-red-50",
        selectedBg: "bg-red-500",
        selectedText: "text-white",
    },
    {
        id: "performance",
        name: "Performance humaine",
        description: "Facteurs humains, physiologie",
        icon: LineChart,
        color: "bg-green-500",
        hoverColor: "hover:bg-green-50",
        selectedBg: "bg-green-500",
        selectedText: "text-white",
    },
    {
        id: "communications",
        name: "Communications",
        description: "Phraséologie, procédures radio",
        icon: Radio,
        color: "bg-purple-500",
        hoverColor: "hover:bg-purple-50",
        selectedBg: "bg-purple-500",
        selectedText: "text-white",
    },
]

// Configuration par défaut pour le mode examen
const examConfig = {
    questionCount: 40,
    duration: 60,
    immediateFeedback: false,
}

export default function QuizPage() {
    // États pour gérer les sélections et configurations
    const [mode, setMode] = useState<"training" | "exam">("training")
    const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
    const [config, setConfig] = useState({
        questionCount: 10,
        duration: 15,
        immediateFeedback: true,
    })
    const [isCreating, setIsCreating] = useState(false)


    // Dans la fonction QuizPage, ajouter le router après les autres états
    //const router = useRouter()

    // Référence pour le scroll automatique
    const configSectionRef = useRef<HTMLDivElement>(null)

    // Fonction pour réinitialiser la sélection de thème
    const resetThemeSelection = () => {
        setSelectedTheme(null)
    }

    // Fonction pour mettre à jour la configuration
    const updateConfig = (key: keyof typeof config, value: number | boolean) => {
        setConfig((prev) => ({ ...prev, [key]: value }))
    }

    // Fonction pour sélectionner un thème et scroller vers la configuration
    const selectTheme = (themeId: string) => {
        setSelectedTheme(themeId)

        // Attendre que le DOM soit mis à jour avant de scroller
        setTimeout(() => {
            if (configSectionRef.current) {
                configSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
            }
        }, 100)
    }

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-bold mb-2">Démarrer un questionnaire</h1>
                <p className="text-muted-foreground">Choisissez un mode, un thème et configurez votre questionnaire</p>
            </div>

            {/* Sélection du mode */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Mode de questionnaire</h2>
                <Tabs
                    defaultValue="training"
                    className="w-full"
                    onValueChange={(value) => {
                        setMode(value as "training" | "exam")
                        // Réinitialiser la sélection de thème lors du changement de mode
                        resetThemeSelection()
                    }}
                >
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="training" className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Entraînement
                        </TabsTrigger>
                        <TabsTrigger value="exam" className="flex items-center gap-2">
                            <Timer className="h-4 w-4" />
                            Mode examen
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="training">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mode Entraînement</CardTitle>
                                <CardDescription>Pratiquez à votre rythme avec un feedback immédiat sur vos réponses.</CardDescription>
                            </CardHeader>
                        </Card>
                    </TabsContent>
                    <TabsContent value="exam">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mode Examen</CardTitle>
                                <CardDescription>
                                    Simulez les conditions d&#39;examen avec un temps limité et sans feedback immédiat.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Sélection du thème */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Choisissez un thème</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {themes.map((theme) => {
                        const isSelected = selectedTheme === theme.id
                        return (
                            <Card
                                key={theme.id}
                                className={`overflow-hidden py-0 gap-3 transition-colors duration-200 ${isSelected ? theme.selectedBg : "bg-white"} ${!isSelected ? theme.hoverColor : ""}`}
                            >
                                <div className={`h-1.5 ${theme.color}`} />
                                <CardHeader className="p-4">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className={`text-lg ${isSelected ? theme.selectedText : ""}`}>{theme.name}</CardTitle>
                                        <theme.icon className={`h-5 w-5 ${isSelected ? "text-white" : "text-muted-foreground"}`} />
                                    </div>
                                    <CardDescription className={isSelected ? theme.selectedText : ""}>
                                        {theme.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className="p-4 pt-0">
                                    <Button
                                        variant={isSelected ? "secondary" : "outline"}
                                        className="w-full"
                                        onClick={() => selectTheme(theme.id)}
                                    >
                                        {isSelected ? "Sélectionné" : "Choisir"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            </div>

            {/* Panneau de configuration du quiz - toujours présent mais conditionnellement visible */}
            <div
                ref={configSectionRef}
                className={`space-y-4 transition-opacity duration-300 ${selectedTheme ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Configuration du questionnaire</h2>
                    <Button variant="ghost" onClick={resetThemeSelection}>
                        Changer de thème
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{themes.find((t) => t.id === selectedTheme)?.name}</CardTitle>
                        <CardDescription>Personnalisez votre questionnaire selon vos besoins</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="questionCount">Nombre de questions</Label>
                                <Input
                                    id="questionCount"
                                    type="number"
                                    min="5"
                                    max="50"
                                    value={mode === "exam" ? examConfig.questionCount : config.questionCount}
                                    onChange={(e) => updateConfig("questionCount", Number.parseInt(e.target.value))}
                                    disabled={mode === "exam"}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">Durée (minutes)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    min="5"
                                    max="120"
                                    value={mode === "exam" ? examConfig.duration : config.duration}
                                    onChange={(e) => updateConfig("duration", Number.parseInt(e.target.value))}
                                    disabled={mode === "exam"}
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="immediateFeedback"
                                checked={mode === "exam" ? examConfig.immediateFeedback : config.immediateFeedback}
                                onCheckedChange={(checked) => updateConfig("immediateFeedback", Boolean(checked))}
                                disabled={mode === "exam"}
                            />
                            <Label htmlFor="immediateFeedback">Afficher le feedback immédiatement après chaque réponse</Label>
                        </div>

                        {mode === "exam" && (
                            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
                                <div className="flex items-start">
                                    <HelpCircle className="h-5 w-5 mr-2 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Mode examen</p>
                                        <p className="text-sm">
                                            En mode examen, les paramètres sont verrouillés pour simuler les conditions réelles d&#39;examen.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => setIsCreating(true)}>
                            Commencer le questionnaire
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            {isCreating && selectedTheme && <QuizPreparationScreen selectedTheme={selectedTheme} />}
        </div>
    )
}
