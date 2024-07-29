// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, sendEmailVerification } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDUXMhYFwg4RxCcY_Yk-cUqQf4_X_j-Q1I",
    authDomain: "b-lock-a-blockchain-e-vault.firebaseapp.com",
    projectId: "b-lock-a-blockchain-e-vault",
    storageBucket: "b-lock-a-blockchain-e-vault.appspot.com",
    messagingSenderId: "451994949044",
    appId: "1:451994949044:web:2de1df44332663ff708ee1",
    measurementId: "G-EV28R21MF6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Authentication
const auth = getAuth(app);

// Function to send verification email
const sendVerificationEmail = async (user) => {
  if (user) {
    try {
      await sendEmailVerification(user);  // Send verification email
      console.log('Verification email sent successfully.');
    } catch (error) {
      console.error('Error sending verification email:', error); // Log detailed error
      // Display a user-friendly error message
      alert('Error sending verification email. Please try again later.');
    }
  }
};

export { db, storage, auth, sendVerificationEmail };
