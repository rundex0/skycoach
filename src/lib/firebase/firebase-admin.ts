import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app';

function createFirebaseAdminApp() {
    if (getApps().length === 0) {
        initializeApp({
            credential: applicationDefault(),
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
    }
}

export default createFirebaseAdminApp;