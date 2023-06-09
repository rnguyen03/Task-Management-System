import React, { useState, useContext } from "react";
import "../Styles/Register.scss";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import Axios from "axios";

const Login = () => {
    const { startSession } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(true);
    const navigate = useNavigate();

    const handleLog = () => (
        Axios.post("http://localhost:4000/auth/Login", {
            email: email,
            password: password,
        }).then(response => {
            const user = { uid: response.data.uid, email: response.data.email};
            startSession(user);
            navigate('/Home');
            setLoginSuccess(true);
        })
        .catch(error => {
            console.error(error);
            setLoginSuccess(false);
            setPassword('')
        })
    )

  return (
    <div className="Register">
      <Navbar/>
      <div className="Wrapper">
        <div className="Container">
            <label className="LoginLabel">Login</label>

            <input 
            className="Input" 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}>
            </input>

            <input 
            className="Input" 
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}>
            </input>

            {/* <a href="" className="ForgotPassLabel">
            Forgot your password?
            </a> */}
            
            {loginSuccess ? <p className="Error"></p> : <p className="Error">Error. Invalid Email and/or Password.</p>}

            <button className="Button" onClick={handleLog}>
            Log in
            </button>
            <label className="CreateAccLabel">Don't have an account?</label>

            <div className="SignUpLabel">
            <a href="/#">
                <Link to="/Register">Sign up</Link>
            </a>
            </div>

        </div>
      </div>

    </div>
  );
};

export default Login;
