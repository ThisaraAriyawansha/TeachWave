import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale } from 'chart.js';
import { FaHome, FaChartBar, FaCog } from 'react-icons/fa';

// Chart.js setup
ChartJS.register(LineElement, CategoryScale, LinearScale);

// Simple styles
const sidebarStyle = {
  width: '200px',
  height: '100vh',
  backgroundColor: '#f4f4f4',
  padding: '10px',
  boxSizing: 'border-box',
  float: 'left',
};

const navbarStyle = {
  backgroundColor: '#333',
  color: '#fff',
  padding: '10px',
  textAlign: 'center',
};

const contentStyle = {
  marginLeft: '220px',
  padding: '20px',
};

const linkStyle = {
  textDecoration: 'none',
  color: '#333',
  display: 'block',
  padding: '10px',
};

// Sidebar Component
const Sidebar = () => (
  <div style={sidebarStyle}>
    <h2>Dashboard</h2>
    <ul>
      <li><Link to="/" style={linkStyle}><FaHome /> Home</Link></li>
      <li><Link to="/charts" style={linkStyle}><FaChartBar /> Charts</Link></li>
      <li><Link to="/settings" style={linkStyle}><FaCog /> Settings</Link></li>
    </ul>
  </div>
);

// Navbar Component
const Navbar = () => (
  <div style={navbarStyle}>
    <h1>My Dashboard</h1>
  </div>
);

// Home Component
const Home = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Monthly Sales',
        data: [30, 45, 20, 55, 40, 60, 50],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div style={contentStyle}>
      <h2>Home</h2>
      <Line data={data} />
    </div>
  );
};

// Settings Component
const Settings = () => (
  <div style={contentStyle}>
    <h2>Settings</h2>
    <p>Settings page content goes here.</p>
  </div>
);

// Charts Component
const Charts = () => (
  <div style={contentStyle}>
    <h2>Charts</h2>
    <p>Charts page content goes here.</p>
  </div>
);

// Main Dashboard Component
const Dashboard = () => (
  <Router>
    <div>
      <Navbar />
      <Sidebar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/charts" component={Charts} />
        <Route path="/settings" component={Settings} />
      </Switch>
    </div>
  </Router>
);

export default Dashboard;
