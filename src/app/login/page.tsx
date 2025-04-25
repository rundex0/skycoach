"use client"

import React, {useEffect} from "react"

import { useState } from "react"
import {redirect, useRouter} from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plane, Lock, Mail, User } from "lucide-react"
import {auth} from "@/lib/firebase/client";
import {signInWithEmailAndPassword} from "@firebase/auth";
import {useAuth} from "@/hooks/use-auth";

export default function LoginPage() {
    const {isUserLoading, user} = useAuth()

    useEffect(() => {
        if(!isUserLoading && user) redirect('/')
    }, [isUserLoading, user])

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    })
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setRegisterData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleCheckboxChange = (checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            rememberMe: checked,
        }))
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            await signInWithEmailAndPassword(auth, formData.email, formData.password)


            toast("Connexion réussie", {
                description: "Bienvenue sur PPL Révisions",
            })

            // Redirection vers le tableau de bord
            router.push("/dashboard")
        } catch (error) {
            console.log(error)
            toast("Erreur de connexion", {
                description: "Vérifiez vos identifiants et réessayez"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        if (registerData.password !== registerData.confirmPassword) {
            toast("Erreur d'inscription", {
                description: "Les mots de passe ne correspondent pas"
            })
            setIsLoading(false)
            return
        }

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))

            toast("Inscription réussie", {
                description: "Votre compte a été créé avec succès",
            })

            // Redirection vers le tableau de bord
            router.push("/dashboard")
        } catch (error) {
            toast("Erreur d'inscription", {
                description: "Une erreur est survenue lors de la création de votre compte"
            })
        } finally {
            setIsLoading(false)
        }
    }

    if(isUserLoading)
        return (<div>Loading...</div>)

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <div className="bg-blue-500 p-3 rounded-full">
                        <Plane className="h-8 w-8 text-white" />
                    </div>
                </div>

                <Card className="w-full">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">PPL Révisions</CardTitle>
                        <CardDescription className="text-center">
                            Connectez-vous pour accéder à votre espace de révision
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="login">Connexion</TabsTrigger>
                                <TabsTrigger value="register">Inscription</TabsTrigger>
                            </TabsList>

                            <TabsContent value="login">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="exemple@aviation.fr"
                                                className="pl-10"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <Label htmlFor="password">Mot de passe</Label>
                                            <Link href="/forgot-password" className="text-sm text-blue-500 hover:text-blue-600">
                                                Mot de passe oublié?
                                            </Link>
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="password"
                                                name="password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="rememberMe" checked={formData.rememberMe} onCheckedChange={handleCheckboxChange} />
                                        <Label htmlFor="rememberMe" className="text-sm">
                                            Se souvenir de moi
                                        </Label>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Connexion en cours..." : "Se connecter"}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="register">
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="register-name">Nom complet</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="register-name"
                                                name="name"
                                                type="text"
                                                placeholder="Jean Dupont"
                                                className="pl-10"
                                                value={registerData.name}
                                                onChange={handleRegisterInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="register-email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="register-email"
                                                name="email"
                                                type="email"
                                                placeholder="exemple@aviation.fr"
                                                className="pl-10"
                                                value={registerData.email}
                                                onChange={handleRegisterInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="register-password">Mot de passe</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="register-password"
                                                name="password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10"
                                                value={registerData.password}
                                                onChange={handleRegisterInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="register-confirm-password">Confirmer le mot de passe</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="register-confirm-password"
                                                name="confirmPassword"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10"
                                                value={registerData.confirmPassword}
                                                onChange={handleRegisterInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Inscription en cours..." : "S'inscrire"}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="text-center text-sm text-gray-500">
                            En vous connectant, vous acceptez nos{" "}
                            <Link href="/terms" className="text-blue-500 hover:text-blue-600">
                                conditions d&#39;utilisation
                            </Link>{" "}
                            et notre{" "}
                            <Link href="/privacy" className="text-blue-500 hover:text-blue-600">
                                politique de confidentialité
                            </Link>
                            .
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
