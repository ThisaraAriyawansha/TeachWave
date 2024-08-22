import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoadingScreen from './components/Loading';
import CreateAccount from './components/CreateAccount'; 
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoadingScreen />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </Router>
  );
};

export default App;