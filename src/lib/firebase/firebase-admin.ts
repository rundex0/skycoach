import 'server-only'

import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app';
import {getFirestore} from "firebase-admin/firestore";
import {getAuth} from "firebase-admin/auth";

export function getFirebaseAdmin() {
    if (getApps().length === 0) {
        return initializeApp({
            credential: applicationDefault(),
            projectId: process.env.FIREBASE_PROJECT_ID,
        });
    } else return getApps()[0]
}

export const adminAuth  = () => getAuth(getFirebaseAdmin())
export const adminDb    = () => getFirestore(getFirebaseAdmin())