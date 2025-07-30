import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const BackButtonContainer = styled(motion.button)`
  position: fixed;
  bottom: 30px;
  left: 40px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #A076F9, #7E57C2);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(160, 118, 249, 0.3);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(160, 118, 249, 0.4);
    transform: translateY(-2px) scale(1.05);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  svg {
    color: white;
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    bottom: 20px;
    left: 25px;
    width: 45px;
    height: 45px;
    
    svg {
      font-size: 1.1rem;
    }
  }
`;

const TooltipText = styled.div`
  position: absolute;
  left: 60px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(25, 25, 30, 0.95);
  color: #e0e0e0;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(160, 118, 249, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    left: -5px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-right: 5px solid rgba(25, 25, 30, 0.95);
  }

  ${BackButtonContainer}:hover & {
    opacity: 1;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const BackButton = ({ defaultPath = "/" }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        // Always navigate to home page
        navigate(defaultPath);
    };

    // Don't show the back button on the home page
    if (location.pathname === defaultPath) {
        return null;
    }

    return (
        <BackButtonContainer
            onClick={handleBack}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <FaHome />
            <TooltipText>Go Home</TooltipText>
        </BackButtonContainer>
    );
};

export default BackButton;
