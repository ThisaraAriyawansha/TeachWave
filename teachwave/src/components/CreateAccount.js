import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CreateAccount.css';
import registerImage from './image/register2.jpg';
import loginImage from './image/login.jpg';

const CreateAccount = () => {
  const [isRegister, setIsRegister] = useState(true);

  const handleToggle = () => {
    setIsRegister(!isRegister);
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>

        <AnimatePresence>
          <motion.div
            key={isRegister ? 'register-form' : 'login-form'}
            className="form-wrapper"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="form-title">{isRegister ? 'Create Account' : 'Login'}</h1>
            <form className="auth-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="Enter your email"
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
    </div>
  );
};

export default CreateAccount;
