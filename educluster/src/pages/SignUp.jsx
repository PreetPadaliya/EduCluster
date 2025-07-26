import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaEnvelope, FaUserTag, FaIdCard, FaPhone, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { validateUsername, validatePassword, validateEmail, validatePhone, validateId, validateConfirmPassword, validateName } from "../utils/validation";

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
  grid-column: 1 / -1;
`;

const PasswordRequirements = styled(motion.div)`
  background-color: rgba(160, 118, 249, 0.05);
  border-left: 3px solid #A076F9;
  padding: 0.8rem 1rem;
  margin: 0.5rem 0 1rem 0;
  border-radius: 4px;
  grid-column: 1 / -1;
  
  h4 {
    color: #A076F9;
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  ul {
    margin: 0;
    padding-left: 1.5rem;
    
    li {
      color: #a0a0a0;
      font-size: 0.8rem;
      margin-bottom: 0.2rem;
      
      &.valid {
        color: #66BB6A;
      }
      
      &.invalid {
        color: #ff6b6b;
      }
    }
  }
`;

const SignUp = ({ onSignUp }) => {
  const navigate = useNavigate();
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
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [validationStates, setValidationStates] = useState({
    length: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    special: false,
    match: false
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Password validation effect
  useEffect(() => {
    if (formData.password) {
      setValidationStates({
        length: formData.password.length >= 8,
        upperCase: /[A-Z]/.test(formData.password),
        lowerCase: /[a-z]/.test(formData.password),
        number: /[0-9]/.test(formData.password),
        special: /[!@#$%^&*]/.test(formData.password),
        match: formData.password === formData.confirmPassword && formData.confirmPassword !== ""
      });
    }
  }, [formData.password, formData.confirmPassword]);

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

    // Clear field-specific error when user starts typing again
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }

    // Clear general error
    if (error) setError("");

    // Show password requirements when user focuses on password field
    if (name === "password") {
      setShowPasswordRequirements(true);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate each field
    newErrors.firstName = validateName(formData.firstName);
    newErrors.lastName = validateName(formData.lastName);
    newErrors.email = validateEmail(formData.email);
    newErrors.phone = validatePhone(formData.phone);
    newErrors.id = validateId(formData.id);
    newErrors.password = validatePassword(formData.password);
    newErrors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);

    setErrors(newErrors);

    // Check if there are any errors
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // If validation fails, scroll to first error
      const firstErrorField = Object.keys(errors).find(key => errors[key]);
      if (firstErrorField) {
        document.getElementsByName(firstErrorField)[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsLoading(true);
    setError("");

    // Always succeed in demo version, no random failure
    setTimeout(() => {
      try {
        // Call the onSignUp function passed as prop
        if (onSignUp) {
          onSignUp(formData);
          console.log("User registered successfully:", formData);

          // No need to store in localStorage or redirect to login
          // The onSignUp function will handle the automatic login
          // and the App component will automatically show the main interface
        } else {
          throw new Error("onSignUp function is not available");
        }
      } catch (err) {
        console.error("Registration error:", err);
        setError("There was a problem creating your account. Please try again.");
      } finally {
        setIsLoading(false);
      }
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
          {error && <GeneralError>{error}</GeneralError>}

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
              style={{ borderColor: errors.firstName ? '#ff6b6b' : 'transparent' }}
            />
            {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
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
              style={{ borderColor: errors.lastName ? '#ff6b6b' : 'transparent' }}
            />
            {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
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
              style={{ borderColor: errors.email ? '#ff6b6b' : 'transparent' }}
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
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
              required
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.45 }}
              style={{ borderColor: errors.phone ? '#ff6b6b' : 'transparent' }}
            />
            {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <IconWrapper>
              <FaUser />
            </IconWrapper>
            <Input
              type="text"
              placeholder="ID No."
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ borderColor: errors.id ? '#ff6b6b' : 'transparent' }}
            />
            {errors.id && <ErrorMessage>{errors.id}</ErrorMessage>}
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
                style={{
                  color: roleColors[formData.role],
                  borderColor: errors.role ? '#ff6b6b' : 'transparent'
                }}
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
              style={{ borderColor: errors.password ? '#ff6b6b' : 'transparent' }}
            />
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </InputGroup>

          {showPasswordRequirements && (
            <PasswordRequirements
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4><FaInfoCircle /> Password Requirements</h4>
              <ul>
                <li className={validationStates.length ? 'valid' : 'invalid'}>
                  At least 8 characters
                </li>
                <li className={validationStates.upperCase ? 'valid' : 'invalid'}>
                  At least one uppercase letter
                </li>
                <li className={validationStates.lowerCase ? 'valid' : 'invalid'}>
                  At least one lowercase letter
                </li>
                <li className={validationStates.number ? 'valid' : 'invalid'}>
                  At least one number
                </li>
                <li className={validationStates.special ? 'valid' : 'invalid'}>
                  At least one special character (!@#$%^&*)
                </li>
                <li className={validationStates.match ? 'valid' : 'invalid'}>
                  Passwords must match
                </li>
              </ul>
            </PasswordRequirements>
          )}

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
              style={{ borderColor: errors.confirmPassword ? '#ff6b6b' : 'transparent' }}
            />
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
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
            {isLoading ? "Creating Account & Logging In..." : "Create Account & Login"}
          </Button>

          <div style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '0.8rem', color: '#a0a0a0' }}>
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </div>

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