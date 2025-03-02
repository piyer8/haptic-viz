import React from 'react';
import logo from './logo.svg';
import './App.css';
import EmotionalData from './components/EmotionalData';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />  
        <Route path="/emotional-data/:signalID" element={<EmotionalData />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
