// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
<<<<<<< HEAD
import { getAuth, sendEmailVerification } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDUXMhYFwg4RxCcY_Yk-cUqQf4_X_j-Q1I",
    authDomain: "b-lock-a-blockchain-e-vault.firebaseapp.com",
    projectId: "b-lock-a-blockchain-e-vault",
    storageBucket: "b-lock-a-blockchain-e-vault.appspot.com",
    messagingSenderId: "451994949044",
    appId: "1:451994949044:web:2de1df44332663ff708ee1",
    measurementId: "G-EV28R21MF6"
=======
import { getAuth } from 'firebase/auth'; // Ensure this is included if you need auth

const firebaseConfig = {
  apiKey: "AIzaSyDUXMhYFwg4RxCcY_Yk-cUqQf4_X_j-Q1I",
  authDomain: "b-lock-a-blockchain-e-vault.firebaseapp.com",
  projectId: "b-lock-a-blockchain-e-vault",
  storageBucket: "b-lock-a-blockchain-e-vault.appspot.com",
  messagingSenderId: "451994949044",
  appId: "1:451994949044:web:2de1df44332663ff708ee1",
  measurementId: "G-EV28R21MF6"
>>>>>>> 31e7d488fffc28bf812c930ffbdbbd644c1aa30f
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
const db = getFirestore(app);
<<<<<<< HEAD
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
=======
const storage = getStorage(app); // This is the storage instance
const auth = getAuth(app); // Include if you need auth

export { db, storage, auth }; // Export storage and auth
>>>>>>> 31e7d488fffc28bf812c930ffbdbbd644c1aa30f
