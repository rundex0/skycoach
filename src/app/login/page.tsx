"use client"

import React, {useActionState} from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plane, Lock, Mail, User } from "lucide-react"
import {login} from "@/app/actions/auth";

export default function LoginPage() {
    const [state, action, pending] = useActionState(login, undefined)


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
                                <form action={action} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="email"
                                                name="email"
                                                placeholder="exemple@aviation.fr"
                                                className="pl-10"
                                                required
                                            />
                                            {state?.errors?.email && <p>{state.errors.email}</p>}
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
                                                required
                                            />
                                            {state?.errors?.password && <p>{state.errors.password}</p>}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="rememberMe" />
                                        <Label htmlFor="rememberMe" className="text-sm">
                                            Se souvenir de moi
                                        </Label>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={pending}>
                                        {pending ? "Connexion en cours..." : "Se connecter"}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="register">
                                <form className="space-y-4">
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
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={pending}>
                                        {pending ? "Inscription en cours..." : "S'inscrire"}
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
