import React, { useState } from 'react';
import './style.css';
import {Link} from 'react-router-dom';
import {auth} from './firebase';
import {createUserWithEmailAndPassword} from 'firebase/auth'

function SignUpForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            createUserWithEmailAndPassword(auth, email, password)
            console.log("Account Created")
        } catch(err){
            console.log(err)
        }
    }
  return (
    <div className='signup-container'>
        <form className='signup-form' onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            <label htmlFor="email">
                Email:
                <input type="text" onChange={(e) => setEmail(e.target.value)}/>
            </label>
            <label htmlFor="password">
                Password:
                <input type="text" onChange={(e) => setPassword(e.target.value)}/>
            </label>
            <button type='submit'>SignUp</button>
            <p>Already registered?<Link to="/login">Login</Link></p>
        </form>
    </div>
  )
}

export default SignUpForm;