import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import CheckOutList from './views/CheckOutList';
import BookList from './views/BookList';
import Home from './views/Home';
import GoogleLoginButton from './component/GoogleLoginButton';
import { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import './config/i18n';
import LanguageSwitcher from './component/LanguageSwitcher';


const clientId = "99768717874-tjn91p480djdbniisjs9a7i1b5brb5dd.apps.googleusercontent.com";


function App() {
    
    const [theme, setTheme] = useState('light'); // 'light' lub 'dark'
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: clientId,
                scope: ""
            })
        };
    
        gapi.load('client:auth2', start);
    });

    return (
    <div className={`App ${theme === 'light' ? 'theme-light' : 'theme-dark'}`}>
    <div id="opcje" >
      <LanguageSwitcher />
    <button onClick={toggleTheme}>Zmień motyw</button>
    <div id="logowanie">
        <GoogleLoginButton/>
    </div>
    </div>
        <Router>
            <Routes>
                <Route path="/Books" Component={BookList} theme={theme}/>
                <Route path="/CheckOuts" Component={CheckOutList} theme={theme}/>
                <Route path="/" Component={Home} theme={theme}/>
            </Routes>
        </Router>
        </div>
    );
}

export default App;