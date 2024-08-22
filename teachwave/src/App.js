import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingScreen from './components/Loading';
import CreateAccount from './components/CreateAccount';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoadingScreen />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default App;
