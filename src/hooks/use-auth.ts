import {useEffect, useState} from "react";
import {listenAuthState} from "@/lib/firebase/client";
import {User} from "firebase/auth";


export function useAuth(){
    const [isUserLoading, setIsUserLoading] = useState<boolean>(true)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const unsubscribe = listenAuthState((user) => {
            setUser(user)
            setIsUserLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return {isUserLoading, user}
}