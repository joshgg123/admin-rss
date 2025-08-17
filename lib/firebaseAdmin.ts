// lib/firebaseAdmin.ts
import * as admin from "firebase-admin";

// Evitamos reinicializar en hot-reload/local
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // en Vercel la PRIVATE_KEY se guarda con \n, acá la normalizamos
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();
export default db;
