import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaUserTag } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { validateUsername, validatePassword } from '../utils/validation';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
`;

const LoginBox = styled(motion.div)`
  background: rgba(18, 18, 20, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(50, 50, 60, 0.4);
`;

const LoginTitle = styled(motion.h2)`
  color: #e0e0e0;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 1.8rem;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  width: 100%;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  padding-left: 1rem;
  text-align: left;
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const GeneralError = styled(ErrorMessage)`
  background-color: rgba(255, 107, 107, 0.1);
  border-left: 3px solid #ff6b6b;
  padding: 0.8rem 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid transparent;
  border-radius: 50px;
  background-color: rgba(30, 30, 35, 0.8);
  color: #e0e0e0;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);

  &:focus {
    box-shadow: 0 4px 12px rgba(160, 118, 249, 0.4);
    background-color: rgba(40, 40, 45, 0.9);
    border-color: #A076F9;
  }

  &::placeholder {
    color: #a0a0a0;
  }
  
  &.error {
    border-color: #ff6b6b;
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: #A076F9;
  font-size: 1.2rem;
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 50px;
  background: linear-gradient(135deg, #A076F9, #7E57C2);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: 0 6px 12px rgba(160, 118, 249, 0.4);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: translateY(0);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }
  
  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(45deg);
    opacity: 0;
    transition: opacity 0.6s;
  }
  
  &:hover:not(:disabled):before {
    opacity: 1;
    animation: shine 1.5s ease-in-out infinite;
  }
  
  @keyframes shine {
    0% {
      left: -100%;
      opacity: 0;
    }
    20% {
      opacity: 0.1;
    }
    100% {
      left: 100%;
      opacity: 0;
    }
  }
`;

const ForgotPassword = styled(motion.a)`
  color: #A076F9;
  text-decoration: none;
  font-size: 0.9rem;
  text-align: right;
  display: block;
  margin-top: 1.5rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;

  &:hover {
    color: #c3a3fa;
    background-color: rgba(160, 118, 249, 0.05);
  }
`;

const CreateAccount = styled(motion.div)`
  margin-top: 2.5rem;
  text-align: center;
  font-size: 1rem;
  color: #a0a0a0;

  a {
    color: #A076F9;
    text-decoration: none;
    font-weight: 600;
    cursor: pointer;
    margin-left: 0.5rem;
    padding-bottom: 2px;
    border-bottom: 1px dashed transparent;
    transition: all 0.3s ease;

    &:hover {
      color: #c3a3fa;
      border-bottom-color: #c3a3fa;
    }
  }
`;

const SelectGroup = styled(InputGroup)`
  margin-bottom: 2rem;
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Select = styled(motion.select)`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: none;
  border-radius: 50px;
  background-color: rgba(30, 30, 35, 0.8);
  color: #e0e0e0;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  appearance: none;
  cursor: pointer;
  text-transform: capitalize;

  &:focus {
    box-shadow: 0 4px 12px rgba(160, 118, 249, 0.4);
    background-color: rgba(40, 40, 45, 0.9);
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(160, 118, 249, 0.4);
  }

  option {
    background-color: #1e1e24;
    color: #e0e0e0;
    text-transform: capitalize;
    padding: 10px;
  }
`;

const SelectArrow = styled(motion.div)`
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #A076F9;
  pointer-events: none;
  transition: all 0.3s ease;

  ${SelectWrapper}:hover & {
    border-top-color: #c3a3fa;
    transform: translateY(-50%) scale(1.1);
  }
`;

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const roleColors = {
    principal: '#A076F9',
    hod: '#B38BFF',
    faculty: '#9C6CFF',
    student: '#CBA9FF',
    admin: '#7E57C2'
  };

  // Validation functions are now imported from utils/validation.js

  const handleSubmit = (e) => {
    e.preventDefault();

    // If account is locked, prevent login
    if (isLocked) {
      return;
    }

    // Validate inputs
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    const newErrors = {
      username: usernameError,
      password: passwordError
    };

    setErrors(newErrors);

    // If no errors, proceed with login
    if (!usernameError && !passwordError) {
      setIsLoading(true);

      // Mock authentication - in a real app this would call an API
      setTimeout(() => {
        // Simulate failed login for demo purposes (70% success rate)
        const loginSuccess = Math.random() > 0.3;

        if (loginSuccess) {
          // Reset login attempts on successful login
          setLoginAttempts(0);
          onLogin({ username, role });
        } else {
          // Increment login attempts
          const newAttempts = loginAttempts + 1;
          setLoginAttempts(newAttempts);

          // Lock account after 5 failed attempts
          if (newAttempts >= 5) {
            setIsLocked(true);
            setErrors({
              ...newErrors,
              general: "Account locked due to multiple failed attempts. Please try again after 30 minutes."
            });

            // Unlock account after 30 minutes (in a real app, this would be handled by backend)
            setTimeout(() => {
              setIsLocked(false);
              setLoginAttempts(0);
            }, 30 * 60 * 1000); // 30 minutes
          } else {
            setErrors({
              ...newErrors,
              general: `Invalid username or password. ${5 - newAttempts} attempts remaining.`
            });
          }
        }

        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <LoginContainer>
      <LoginBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoginTitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Welcome to EduCluster
        </LoginTitle>

        <form onSubmit={handleSubmit}>
          {errors.general && <GeneralError>{errors.general}</GeneralError>}

          <InputGroup>
            <IconWrapper>
              <FaUser />
            </IconWrapper>
            <Input
              type="text"
              placeholder="Username or Email"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) {
                  setErrors({ ...errors, username: '' });
                }
              }}
              required
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ borderColor: errors.username ? '#ff6b6b' : 'transparent' }}
            />
            {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <IconWrapper>
              <FaLock />
            </IconWrapper>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors({ ...errors, password: '' });
                }
              }}
              required
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ borderColor: errors.password ? '#ff6b6b' : 'transparent' }}
            />
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </InputGroup>

          <SelectGroup>
            <IconWrapper style={{ color: roleColors[role] || '#A076F9' }}>
              <FaUserTag />
            </IconWrapper>
            <SelectWrapper>
              <Select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  // Reset errors when changing role
                  if (errors.username || errors.password) {
                    setErrors({});
                  }
                }}
                required
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.45 }}
                whileFocus={{ scale: 1.01 }}
                style={{ color: roleColors[role] || '#A076F9' }}
                disabled={isLocked}
              >
                <option value="" disabled>Select Your Role</option>
                <option value="principal">Principal</option>
                <option value="hod">HOD</option>
                <option value="faculty">Faculty</option>
                <option value="student">Student</option>
              </Select>
              <SelectArrow
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ borderTopColor: roleColors[role] || '#A076F9' }}
              />
            </SelectWrapper>
          </SelectGroup>

          <Button
            type="submit"
            whileHover={{ scale: isLocked ? 1 : 1.03 }}
            whileTap={{ scale: isLocked ? 1 : 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            disabled={isLoading || isLocked}
            style={{
              opacity: isLocked ? 0.6 : 1,
              cursor: isLocked ? 'not-allowed' : 'pointer',
              background: isLocked ? 'linear-gradient(135deg, #888, #666)' : undefined
            }}
          >
            {isLoading ? 'Signing In...' : isLocked ? 'Account Locked' : 'Sign In'}
          </Button>

          <div style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '0.8rem', color: '#a0a0a0' }}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </form>

        <ForgotPassword
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          as={Link}
          to="/forgot-password"
        >
          Forgot password?
        </ForgotPassword>

        <CreateAccount
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          New to EduCluster?
          <Link
            to="/signup"
            style={{
              color: '#A076F9',
              textDecoration: 'none',
              fontWeight: 600,
              marginLeft: '0.5rem',
              position: 'relative',
              display: 'inline-block'
            }}
            whileHover={{ scale: 1.05 }}
            as={motion.a}
          >
            Create Account
          </Link>
        </CreateAccount>
      </LoginBox>
    </LoginContainer>
  );
};

export default Login;

