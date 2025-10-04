import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { validateUsername, validatePassword } from "../utils/validation";

const GlobalStyles = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
`;

const LoginContainer = styled.div`
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

const LoginBox = styled(motion.div)`
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

const LoginTitle = styled(motion.h2)`
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
  background: linear-gradient(135deg, #a076f9, #7e57c2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1rem;
  width: 100%;
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 0.8rem 0.8rem 0.8rem 2.8rem;
  border: 2px solid transparent;
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
    border-color: #a076f9;
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
  color: #a076f9;
  font-size: 1.2rem;
`;

const ErrorMessage = styled(motion.div)`
  color: #ff6b6b;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  padding-left: 1rem;
  text-align: left;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
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

const SuccessMessage = styled(GeneralError)`
  background-color: rgba(102, 187, 106, 0.1);
  border-left: 3px solid #66bb6a;
  color: #66bb6a;
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 50px;
  background: linear-gradient(135deg, #a076f9, #7e57c2);
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

const LoginPrompt = styled(motion.div)`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.95rem;
  color: #a0a0a0;

  a {
    color: #a076f9;
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

const Login = ({ onLogin }) => {
  const location = useLocation();
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Check for signup success message and pre-fill the enrollment number
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      if (location.state?.newUserId) {
        setEnrollmentNo(location.state.newUserId);
      }
      // Clear the message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    }
  }, [location]);

  // Validation functions are now imported from utils/validation.js

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    const enrollmentNoError = validateUsername(enrollmentNo);
    const passwordError = validatePassword(password);

    const newErrors = {
      enrollmentNo: enrollmentNoError,
      password: passwordError,
    };

    setErrors(newErrors);

    // If no errors, proceed with login
    if (!enrollmentNoError && !passwordError) {
      setIsLoading(true);

      try {
        const response = await fetch("http://localhost:3001/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: enrollmentNo, // Can be email or ID
            password: password,
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Successful login - role is determined by backend
          const userDataToPass = {
            enrollmentNo: data.user.id,
            role: data.user.role.toLowerCase(), // Convert to lowercase to match frontend expectations
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            username: `${data.user.firstName} ${data.user.lastName}`,
          };

          onLogin(userDataToPass);
        } else {
          // Login failed
          setErrors({
            ...newErrors,
            general:
              data.message ||
              "Invalid credentials or account not approved yet.",
          });
        }
      } catch (error) {
        console.error("Login error:", error);
        setErrors({
          ...newErrors,
          general:
            "Connection error. Please make sure the backend server is running.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <LoginContainer>
      <GlobalStyles />
      <LoginBox
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

        <LoginTitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Sign In to Your Account
        </LoginTitle>

        <Form onSubmit={handleSubmit}>
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
          {errors.general && <GeneralError>{errors.general}</GeneralError>}

          <InputGroup>
            <IconWrapper>
              <FaUser />
            </IconWrapper>
            <Input
              type="text"
              placeholder="ID No. or Email"
              value={enrollmentNo}
              onChange={(e) => {
                setEnrollmentNo(e.target.value);
                if (errors.enrollmentNo) {
                  setErrors({ ...errors, enrollmentNo: "" });
                }
              }}
              required
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                borderColor: errors.enrollmentNo ? "#ff6b6b" : "transparent",
              }}
            />
            {errors.enrollmentNo && (
              <ErrorMessage>{errors.enrollmentNo}</ErrorMessage>
            )}
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
                  setErrors({ ...errors, password: "" });
                }
              }}
              required
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                borderColor: errors.password ? "#ff6b6b" : "transparent",
              }}
            />
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </InputGroup>

          <Button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>

          <div
            style={{
              fontSize: "0.8rem",
              textAlign: "center",
              marginTop: "0.8rem",
              color: "#a0a0a0",
            }}
          >
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>

          <LoginPrompt
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            New to EduCluster?
            <Link to="/signup">Create Account</Link>
          </LoginPrompt>
        </Form>
      </LoginBox>
    </LoginContainer>
  );
};

export default Login;
