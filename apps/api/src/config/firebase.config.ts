import { registerAs } from '@nestjs/config';

export interface FirebaseConfig {
  projectId?: string;
  clientEmail?: string;
  privateKey?: string;
  serviceAccountPath?: string;
  apiKey?: string;
}

export const firebaseConfig = registerAs('firebase', (): FirebaseConfig => {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  return {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey,
    serviceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
    apiKey: process.env.FIREBASE_API_KEY || process.env.FIREBASE_WEB_API_KEY,
  };
});
