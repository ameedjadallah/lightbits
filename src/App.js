import React from 'react';
import logo from './assets/images/logo.png';
import './App.css';
import Servers from './components/servers/servers';

function App() {  
  return (
    <div className="App">
      <div className="logo-section">
        <img src={logo} alt="Lighbits logo"/>
      </div>
      {/* Servers List Components  */}
      <Servers/>
    </div>
  );
}

export default App;
