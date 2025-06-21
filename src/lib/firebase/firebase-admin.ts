import 'server-only'

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import {getFirestore} from "firebase-admin/firestore";
import {getAuth} from "firebase-admin/auth";

const serviceAccount = JSON.parse(
    process.env.GOOGLE_APPLICATION_CREDENTIALS as string
);

export function getFirebaseAdmin() {
    if (getApps().length === 0) {
        return initializeApp({
            credential: cert(serviceAccount),
            projectId: process.env.FIREBASE_PROJECT_ID,
        });
    } else return getApps()[0]
}

export const adminAuth  = () => getAuth(getFirebaseAdmin())
export const adminDb    = () => getFirestore(getFirebaseAdmin())