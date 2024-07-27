// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth'; // Ensure this is included if you need auth

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
const db = getFirestore(app);
const storage = getStorage(app); // This is the storage instance
const auth = getAuth(app); // Include if you need auth

export { db, storage, auth }; // Export storage and auth
