import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingScreen from './components/Loading';
import CreateAccount from './components/CreateAccount';
import Dashboard from './components/Dashboard';
import Python from './components/Python';
import IOT from './components/IOT';
import DataStructures from './components/DataStructures';
import ComputerHardware from './components/ComputerHardware';
import SoftwareEngineering from './components/SoftwareEngineering';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoadingScreen />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/python" element={<Python />} />
      <Route path="/iot" element={<IOT />} />
      <Route path="/dataStructures" element={<DataStructures />} />
      <Route path="/computerHardware" element={<ComputerHardware />} />
      <Route path="/softwareEngineering" element={<SoftwareEngineering />} />

    </Routes>
  );
};

export default App;
