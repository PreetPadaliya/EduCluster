import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaUserTag } from 'react-icons/fa';
import { Link } from 'react-router-dom';

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

const Input = styled(motion.input)`
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

  &:focus {
    box-shadow: 0 4px 12px rgba(160, 118, 249, 0.4);
    background-color: rgba(40, 40, 45, 0.9);
  }

  &::placeholder {
    color: #a0a0a0;
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

  &:hover {
    box-shadow: 0 6px 12px rgba(160, 118, 249, 0.4);
    transform: translateY(-2px);
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

  const roleColors = {
    principal: '#A076F9',
    hod: '#B38BFF',
    faculty: '#9C6CFF',
    student: '#CBA9FF',
    admin: '#7E57C2'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      onLogin({ username, role });
      setIsLoading(false);
    }, 1500);
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
          <InputGroup>
            <IconWrapper>
              <FaUser />
            </IconWrapper>
            <Input
              type="text"
              placeholder="Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            />
          </InputGroup>

          <InputGroup>
            <IconWrapper>
              <FaLock />
            </IconWrapper>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            />
          </InputGroup>

          <SelectGroup>
            <IconWrapper style={{ color: roleColors[role] || '#A076F9' }}>
              <FaUserTag />
            </IconWrapper>
            <SelectWrapper>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.45 }}
                whileFocus={{ scale: 1.01 }}
                style={{ color: roleColors[role] || '#A076F9' }}
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
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <ForgotPassword
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          Forgot password?
        </ForgotPassword>

        <CreateAccount
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          New to EduCluster?
          <Link to="/signup" style={{ color: '#A076F9', textDecoration: 'none', fontWeight: 600, marginLeft: '0.5rem', position: 'relative', display: 'inline-block' }}>
            Create Account
          </Link>
        </CreateAccount>
      </LoginBox>
    </LoginContainer>
  );
};

export default Login;

