// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4eJxmUQtclsd-qRl0PcU5rJ-zhWaGLBk",
  authDomain: "login-with-firebase-329ce.firebaseapp.com",
  projectId: "login-with-firebase-329ce",
  storageBucket: "login-with-firebase-329ce.appspot.com",
  messagingSenderId: "236929427564",
  appId: "1:236929427564:web:03e695982daff6395e1049"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export {auth}