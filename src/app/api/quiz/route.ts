import { getAppCheck } from "firebase-admin/app-check";
import {NextResponse} from "next/server";
import createFirebaseAdminApp from "@/lib/firebase/firebase-admin";

export async function POST(request: Request){
    /*
    const headers = request.headers
    const token = headers.get('Authorization')?.replace('Bearer', '').trim()
    if (!token) return NextResponse.json(
        { error: "Unauthorized: Missing token." },
        { status: 401 }
    );
    createFirebaseAdminApp()
    const user = await getAppCheck().verifyToken(token)
    console.log(user)
    const body = await request.json()
    console.log(token)
    return NextResponse.json(body)
     */
    NextResponse.json({status: 'ok'})
}