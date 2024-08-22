import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify
import './CreateAccount.css';
import registerImage from './image/register2.jpg';
import loginImage from './image/login.jpg';

const CreateAccount = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleToggle = () => {
    setIsRegister(!isRegister);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        await axios.post('http://localhost:5000/register', { email, password });
        toast.success('Registration successful');
      } else {
        await axios.post('http://localhost:5000/login', { email, password });
        toast.success('Login successful');
      }
    } catch (error) {
      toast.error('Error: ' + (error.response?.data.message || 'An unexpected error occurred'));
    }
  };

  return (
    <div className="create-account-container">
      <div className="form-image-wrapper">
        <AnimatePresence>
          <motion.div
            key={isRegister ? 'register' : 'login'}
            className="image-wrapper"
            style={{
              backgroundImage: `url(${isRegister ? registerImage : loginImage})`,
            }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>

        <AnimatePresence>
          <motion.div
            key={isRegister ? 'register-form' : 'login-form'}
            className="form-wrapper"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="form-title">{isRegister ? 'Create Account' : 'Login'}</h1>
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {isRegister && (
                <div className="form-group">
                  <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    id="confirm-password"
                    className="form-input"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}
              <button type="submit" className="submit-button">
                {isRegister ? 'Register' : 'Login'}
              </button>
            </form>
            <p className="toggle-text">
              {isRegister ? 'Already have an account?' : 'Need to create an account?'}
              <span onClick={handleToggle} className="toggle-link">
                {isRegister ? 'Login' : 'Register'}
              </span>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateAccount;
