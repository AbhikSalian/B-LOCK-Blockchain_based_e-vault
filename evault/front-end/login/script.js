// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Handle Sign Up
const signUpForm = document.getElementById('sign-up-form');
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('sign-up-username').value;
    const email = document.getElementById('sign-up-email').value;
    const password = document.getElementById('sign-up-password').value;

    if (validateEmail(email) && validatePassword(password) && validateUsername(username)) {
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                // Store user data in the database
                database.ref('users/' + user.uid).set({
                    username: username,
                    email: email
                });
                // Send email verification
                user.sendEmailVerification()
                    .then(() => {
                        alert("Email Verification link sent!");
                    });
                alert("Sign Up Successful!");
            })
            .catch((error) => {
                console.error('Error during sign up:', error);
            });
    } else {
        alert('Please check your inputs!');
    }
});

// Handle Sign In
const signInForm = document.getElementById('sign-in-form');
signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('sign-in-username').value;
    const password = document.getElementById('sign-in-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            if (user.emailVerified) {
                alert("Sign In Successful!");
            } else {
                alert("Please verify your email first!");
            }
        })
        .catch((error) => {
            console.error('Error during sign in:', error);
        });
});

// Validation functions
function validateEmail(email) {
    const expression = /^[^@]+@\w+(\.\w+)+\w$/;
    return expression.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

function validateUsername(username) {
    return username != null && username.length > 0;
}

// Toggle between sign-in and sign-up forms
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
});
