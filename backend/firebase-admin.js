import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' }); // Ensure it reads from the root .env

let app;

try {
  // Check if FIREBASE_SERVICE_ACCOUNT exists
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    
    // Fix escaped newlines in the private key
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DB_URL
    });
    console.log('[Firebase Admin] Initialized successfully with Service Account.');
  } else {
    console.warn('[Firebase Admin] No FIREBASE_SERVICE_ACCOUNT found in .env');
  }
} catch (error) {
  console.error('[Firebase Admin] Initialization failed:', error);
}

export const adminAuth = app ? admin.auth() : null;
export default admin;
