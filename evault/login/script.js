import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const signUpBtnLink = document.querySelector('.signUpBtn-link');
    const signInBtnLink = document.querySelector('.signInBtn-link');
    const wrapper = document.querySelector('.wrapper');

    signUpBtnLink.addEventListener('click', () => {
        wrapper.classList.toggle('active');
    });

    signInBtnLink.addEventListener('click', () => {
        wrapper.classList.toggle('active');
    });

    // Firebase configuration and initialization
    const firebaseConfig = {
        apiKey: "AIzaSyDUXMhYFwg4RxCcY_Yk-cUqQf4_X_j-Q1I",
        authDomain: "b-lock-a-blockchain-e-vault.firebaseapp.com",
        projectId: "b-lock-a-blockchain-e-vault",
        storageBucket: "b-lock-a-blockchain-e-vault.appspot.com",
        messagingSenderId: "451994949044",
        appId: "1:451994949044:web:fd68cd938123cd8c708ee1",
        measurementId: "G-HHYWTWCQGP"
    };
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getDatabase(app);

    // Handle Sign Up
    const signUpForm = document.getElementById('sign-up-form');
    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('sign-up-username').value;
        const email = document.getElementById('sign-up-email').value;
        const password = document.getElementById('sign-up-password').value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up successfully
                const user = userCredential.user;
                set(ref(db, 'users/' + user.uid), {
                    username: username,
                    email: email
                });

                sendEmailVerification(user)
                    .then(() => {
                        alert("Email Verification link sent!");
                    });
                console.log('User signed up:', user);
            })
            .catch((error) => {
                console.error('Error during sign up:', error);
            });
    });

    // Handle Sign In
    const signInForm = document.getElementById('sign-in-form');
    signInForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('sign-in-username').value;
        const password = document.getElementById('sign-in-password').value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in successfully
                const user = userCredential.user;
                console.log('User signed in:', user);
            })
            .catch((error) => {
                console.error('Error during sign in:', error);
            });
    });
});
