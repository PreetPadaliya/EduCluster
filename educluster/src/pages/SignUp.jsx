import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaEnvelope, FaUserTag, FaIdCard, FaPhone } from "react-icons/fa";
import { Link } from "react-router-dom";

const GlobalStyles = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
`;

const SignUpContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
  padding: 1rem 0;
  box-sizing: border-box;
`;

const SignUpBox = styled(motion.div)`
  background: rgba(18, 18, 20, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(50, 50, 60, 0.4);
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const SignUpTitle = styled(motion.h2)`
  color: #e0e0e0;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.5rem;
`;

const WelcomeTitle = styled(motion.h1)`
  color: #e0e0e0;
  margin-bottom: 0.5rem;
  text-align: center;
  font-size: 2rem;
  background: linear-gradient(135deg, #A076F9, #7E57C2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1rem;
  width: 100%;
  grid-column: ${props => props.fullWidth ? "1 / -1" : "auto"};
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 0.8rem 0.8rem 0.8rem 2.8rem;
  border: none;
  border-radius: 50px;
  background-color: rgba(30, 30, 35, 0.8);
  color: #e0e0e0;
  font-size: 0.95rem;
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

const SelectGroup = styled(InputGroup)`
  margin-bottom: 1rem;
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Select = styled(motion.select)`
  width: 100%;
  padding: 0.8rem 0.8rem 0.8rem 2.8rem;
  border: none;
  border-radius: 50px;
  background-color: rgba(30, 30, 35, 0.8);
  color: #e0e0e0;
  font-size: 0.95rem;
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
  grid-column: 1 / -1;

  &:hover {
    box-shadow: 0 6px 12px rgba(160, 118, 249, 0.4);
    transform: translateY(-2px);
  }
`;

const LoginPrompt = styled(motion.div)`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.95rem;
  color: #a0a0a0;
  grid-column: 1 / -1;

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

const ErrorMessage = styled(motion.div)`
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
  grid-column: 1 / -1;
`;

const SignUp = ({ onSignUp }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    id: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const roleColors = {
    principal: '#A076F9',
    hod: '#B38BFF',
    faculty: '#9C6CFF',
    student: '#CBA9FF',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }


    setTimeout(() => {
      if (onSignUp) {
        onSignUp(formData);
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <SignUpContainer>
      <GlobalStyles />
      <SignUpBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <WelcomeTitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Welcome to EduCluster
        </WelcomeTitle>

        <SignUpTitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Create Your Account
        </SignUpTitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <IconWrapper>
              <FaIdCard />
            </IconWrapper>
            <Input
              type="text"
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            />
          </InputGroup>

          <InputGroup>
            <IconWrapper>
              <FaIdCard />
            </IconWrapper>
            <Input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
            />
          </InputGroup>

          <InputGroup fullWidth>
            <IconWrapper>
              <FaEnvelope />
            </IconWrapper>
            <Input
              type="email"
              placeholder="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            />
          </InputGroup>

          <InputGroup>
            <IconWrapper>
              <FaPhone />
            </IconWrapper>
            <Input
              type="tel"
              placeholder="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.45 }}
            />
          </InputGroup>

          <InputGroup>
            <IconWrapper>
              <FaUser />
            </IconWrapper>
            <Input
              type="text"
              placeholder="ID"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            />
          </InputGroup>

          <SelectGroup>
            <IconWrapper style={{ color: roleColors[formData.role] }}>
              <FaUserTag />
            </IconWrapper>
            <SelectWrapper>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.55 }}
                whileFocus={{ scale: 1.01 }}
                style={{ color: roleColors[formData.role] }}
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
                transition={{ delay: 0.6 }}
                style={{ borderTopColor: roleColors[formData.role] }}
              />
            </SelectWrapper>
          </SelectGroup>

          <InputGroup>
            <IconWrapper>
              <FaLock />
            </IconWrapper>
            <Input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.65 }}
            />
          </InputGroup>

          <InputGroup>
            <IconWrapper>
              <FaLock />
            </IconWrapper>
            <Input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            />
          </InputGroup>

          {error && (
            <ErrorMessage
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </ErrorMessage>
          )}

          <Button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>

          <LoginPrompt
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Already have an account?
            <Link to="/login">Sign In</Link>
          </LoginPrompt>
        </Form>
      </SignUpBox>
    </SignUpContainer>
  );
};

export default SignUp;