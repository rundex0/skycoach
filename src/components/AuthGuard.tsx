import {useAuth} from "@/hooks/use-auth";
import {useRouter} from "next/navigation";
import {useEffect} from "react";


export default function AuthGuard({ children,}: Readonly<{ children: React.ReactNode; }>) {
    const {isUserLoading, user} = useAuth()
    const router = useRouter()

    useEffect(() => {
        if(!isUserLoading && !user) router.push('/login')
    }, [isUserLoading, user, router])

    if(isUserLoading) return (
        <div>Loading...</div>
    )

    return children
}