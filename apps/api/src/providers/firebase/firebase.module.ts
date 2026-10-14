import { Global, Module, Provider, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  initializeApp,
  getApps,
  getApp,
  cert,
  applicationDefault,
  App,
  Credential,
} from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { FIREBASE_APP, FIRESTORE_CLIENT, FIREBASE_AUTH } from './firebase.constants.js';
import type { FirebaseConfig } from '../../config/firebase.config.js';
import { FirestoreService } from './firestore.service.js';

const firebaseAppProvider: Provider = {
  provide: FIREBASE_APP,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const logger = new Logger('FirebaseModule');
    const existingApps = getApps();

    if (existingApps.length > 0) {
      return getApp();
    }

    const config = configService.get<FirebaseConfig>('firebase');
    let credential: Credential | undefined;

    let resolvedServiceAccountPath = config?.serviceAccountPath;
    if (resolvedServiceAccountPath && !existsSync(resolvedServiceAccountPath)) {
      const candidatePath = resolve(process.cwd(), 'apps/api', resolvedServiceAccountPath);
      if (existsSync(candidatePath)) {
        resolvedServiceAccountPath = candidatePath;
      }
    }

    if (resolvedServiceAccountPath && existsSync(resolvedServiceAccountPath)) {
      const fileContent = JSON.parse(readFileSync(resolvedServiceAccountPath, 'utf8'));
      credential = cert(fileContent);
      logger.log(`Initialized Firebase via service account file: ${resolvedServiceAccountPath}`);
    } else if (config?.projectId && config?.clientEmail && config?.privateKey) {
      credential = cert({
        projectId: config.projectId,
        clientEmail: config.clientEmail,
        privateKey: config.privateKey,
      });
      logger.log(`Initialized Firebase via environment credentials for project: ${config.projectId}`);
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      credential = applicationDefault();
      logger.log('Initialized Firebase via GOOGLE_APPLICATION_CREDENTIALS');
    } else {
      logger.warn(
        'Firebase credentials not found. Falling back to applicationDefault() - configure .env or service account for full access.',
      );
      try {
        credential = applicationDefault();
      } catch {
        logger.warn('applicationDefault() failed. Initializing minimal Firebase App.');
      }
    }

    return initializeApp({
      credential,
      projectId: config?.projectId,
    });
  },
};

const firestoreProvider: Provider = {
  provide: FIRESTORE_CLIENT,
  inject: [FIREBASE_APP],
  useFactory: (app: App) => {
    const db = getFirestore(app);
    db.settings({ ignoreUndefinedProperties: true });
    return db;
  },
};

const firebaseAuthProvider: Provider = {
  provide: FIREBASE_AUTH,
  inject: [FIREBASE_APP],
  useFactory: (app: App) => getAuth(app),
};

@Global()
@Module({
  providers: [firebaseAppProvider, firestoreProvider, firebaseAuthProvider, FirestoreService],
  exports: [FIREBASE_APP, FIRESTORE_CLIENT, FIREBASE_AUTH, FirestoreService],
})
export class FirebaseModule {}
