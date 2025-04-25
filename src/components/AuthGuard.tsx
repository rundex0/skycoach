import {useAuth} from "@/hooks/use-auth";
import {redirect} from "next/navigation";
import {useEffect} from "react";


export default function AuthGuard({ children,}: Readonly<{ children: React.ReactNode; }>) {
    const {isUserLoading, user} = useAuth()

    useEffect(() => {
        if(!isUserLoading && !user) redirect('/login')
    }, [isUserLoading, user])

    if(isUserLoading) return (
        <div>Loading...</div>
    )

    return children
}