import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";
import {
    FaClipboardList,
    FaSearch,
    FaFilter,
    FaFileAlt,
    FaCalendarAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaHourglassHalf,
    FaChalkboardTeacher,
    FaBook,
    FaFileUpload,
    FaDownload,
    FaExclamationTriangle,
    FaPlus,
    FaTags,
    FaSortAmountDown,
    FaSortAmountUp,
    FaChartBar,
    FaClock,
    FaEye,
    FaEdit,
    FaTrash,
    FaPaperPlane
} from "react-icons/fa";

// Global styles to ensure proper viewport fitting
const GlobalStyles = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background-color: #121214;
  }
`;

const AssignmentContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #121214;
  color: #e0e0e0;
  padding: 1rem;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(135deg, #e0e0e0, #ffffff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    
    svg {
      color: #A076F9;
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const ToolBar = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const Button = styled(motion.button)`
  padding: 0.6rem 1.2rem;
  background: ${props => props.primary ? 'linear-gradient(135deg, #A076F9, #7E57C2)' : 'rgba(30, 30, 35, 0.6)'};
  color: ${props => props.primary ? 'white' : '#d0d0d0'};
  border: ${props => props.primary ? 'none' : '1px solid rgba(160, 118, 249, 0.3)'};
  border-radius: 50px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: ${props => props.primary ? '600' : '400'};
  display: flex;
  align-items: center;
  gap: 0.6rem;
  box-shadow: ${props => props.primary ? '0 4px 15px rgba(126, 87, 194, 0.3)' : 'none'};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: ${props => props.primary ? '0 6px 20px rgba(126, 87, 194, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.2)'};
    background: ${props => props.primary ? 'linear-gradient(135deg, #b18aff, #9065db)' : 'rgba(40, 40, 45, 0.6)'};
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  max-width: 400px;
  width: 100%;
  
  input {
    width: 100%;
    padding: 0.6rem 1rem 0.6rem 2.5rem;
    border-radius: 50px;
    background: rgba(30, 30, 35, 0.6);
    border: 1px solid rgba(160, 118, 249, 0.2);
    color: #e0e0e0;
    font-size: 0.9rem;
    
    &:focus {
      outline: none;
      border-color: rgba(160, 118, 249, 0.5);
      box-shadow: 0 0 0 2px rgba(160, 118, 249, 0.2);
    }
    
    &::placeholder {
      color: #808080;
    }
  }
  
  svg {
    position: absolute;
    left: 0.8rem;
    top: 50%;
    transform: translateY(-50%);
    color: #808080;
    font-size: 1rem;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid rgba(50, 50, 60, 0.4);
  padding-bottom: 0.5rem;
  overflow-x: auto;
  flex-wrap: nowrap;
  flex: 1;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(160, 118, 249, 0.3);
    border-radius: 10px;
  }
  
  @media (max-width: 768px) {
    margin-right: 0.5rem;
  }
`;

const Tab = styled(motion.button)`
  padding: 0.6rem 1.2rem;
  background: ${props => props.active ? 'rgba(160, 118, 249, 0.15)' : 'transparent'};
  color: ${props => props.active ? '#A076F9' : '#a0a0a0'};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: ${props => props.active ? '600' : '400'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: fit-content;
  
  &:hover {
    background: rgba(160, 118, 249, 0.1);
    color: ${props => props.active ? '#A076F9' : '#d0d0d0'};
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const AssignmentList = styled.div`
  flex: 1;
  min-width: 0;
`;

const AssignmentCard = styled(motion.div)`
  background: rgba(25, 25, 30, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(50, 50, 60, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    border-color: rgba(160, 118, 249, 0.3);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    
    .title-section {
      h3 {
        margin: 0 0 0.5rem;
        font-size: 1.2rem;
        color: #e0e0e0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        
        svg {
          color: #A076F9;
        }
      }
      
      .course-name {
        font-size: 0.9rem;
        color: #a0a0a0;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        
        svg {
          color: #7E57C2;
        }
      }
    }
    
    .status-badge {
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      
      &.pending {
        background: rgba(255, 193, 7, 0.15);
        color: #FFC107;
      }
      
      &.submitted {
        background: rgba(76, 175, 80, 0.15);
        color: #4CAF50;
      }
      
      &.late {
        background: rgba(244, 67, 54, 0.15);
        color: #F44336;
      }
      
      &.graded {
        background: rgba(33, 150, 243, 0.15);
        color: #2196F3;
      }
    }
  }
  
  .card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .info-section {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      
      .info-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: #a0a0a0;
        
        svg {
          color: #A076F9;
        }
        
        &.deadline-soon {
          color: #FF9800;
          font-weight: 500;
          
          svg {
            color: #FF9800;
          }
        }
        
        &.overdue {
          color: #F44336;
          font-weight: 500;
          
          svg {
            color: #F44336;
          }
        }
      }
    }
    
    .action-buttons {
      display: flex;
      gap: 0.5rem;
      
      button {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        background: rgba(30, 30, 35, 0.6);
        color: #d0d0d0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
          background: rgba(160, 118, 249, 0.15);
          color: #A076F9;
        }
      }
    }
  }
  
  .progress-section {
    margin-top: 1rem;
    
    .progress-bar {
      height: 6px;
      background: rgba(50, 50, 60, 0.4);
      border-radius: 3px;
      margin: 0.4rem 0;
      overflow: hidden;
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(135deg, #A076F9, #7E57C2);
        border-radius: 3px;
      }
    }
    
    .progress-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: #a0a0a0;
      
      .progress-percent {
        color: #A076F9;
        font-weight: 600;
      }
    }
  }
`;

const AssignmentDetailSection = styled.div`
  width: 350px;
  flex-shrink: 0;
  
  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const AssignmentDetail = styled(motion.div)`
  background: rgba(25, 25, 30, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(50, 50, 60, 0.4);
  position: sticky;
  top: 1.5rem;
  
  h3 {
    margin: 0 0 1.5rem;
    font-size: 1.3rem;
    color: #e0e0e0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      color: #A076F9;
    }
  }
  
  .detail-section {
    margin-bottom: 1.5rem;
    
    h4 {
      margin: 0 0 0.8rem;
      font-size: 1.1rem;
      color: #d0d0d0;
    }
    
    p {
      margin: 0;
      color: #a0a0a0;
      line-height: 1.6;
    }
    
    .detail-list {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      
      .detail-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #a0a0a0;
        font-size: 0.9rem;
        
        svg {
          color: #A076F9;
          min-width: 16px;
        }
        
        &.highlight {
          color: #A076F9;
          font-weight: 500;
        }
      }
    }
    
    .file-attachments {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 0.8rem;
      
      .attachment {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.6rem 0.8rem;
        border-radius: 8px;
        background: rgba(35, 35, 40, 0.5);
        
        .file-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          
          svg {
            color: #A076F9;
          }
          
          .file-name {
            font-size: 0.9rem;
          }
        }
        
        .download-btn {
          color: #a0a0a0;
          cursor: pointer;
          transition: color 0.2s ease;
          
          &:hover {
            color: #A076F9;
          }
        }
      }
    }
  }
  
  .button-container {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }
`;

const AssignmentSubmission = styled.div`
  background: rgba(25, 25, 30, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(50, 50, 60, 0.4);
  
  h3 {
    margin: 0 0 1.5rem;
    font-size: 1.3rem;
    color: #e0e0e0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      color: #A076F9;
    }
  }
  
  .upload-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    border: 2px dashed rgba(160, 118, 249, 0.3);
    border-radius: 8px;
    background: rgba(35, 35, 40, 0.5);
    transition: all 0.3s ease;
    cursor: pointer;
    
    &:hover {
      border-color: rgba(160, 118, 249, 0.6);
      background: rgba(40, 40, 45, 0.8);
    }
    
    svg {
      color: #A076F9;
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    
    p {
      margin: 0;
      color: #a0a0a0;
      text-align: center;
      
      strong {
        color: #A076F9;
      }
    }
  }
  
  .uploaded-files {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1.5rem;
    
    .file-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.6rem 0.8rem;
      border-radius: 8px;
      background: rgba(35, 35, 40, 0.5);
      
      .file-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        
        svg {
          color: #A076F9;
        }
        
        .file-name {
          font-size: 0.9rem;
        }
      }
      
      .file-actions {
        display: flex;
        gap: 0.5rem;
        
        button {
          background: none;
          border: none;
          color: #a0a0a0;
          cursor: pointer;
          transition: color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          
          &:hover {
            color: #A076F9;
          }
          
          &.delete:hover {
            color: #F44336;
          }
        }
      }
    }
  }
  
  .form-group {
    margin-top: 1.5rem;
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #d0d0d0;
    }
    
    textarea {
      width: 100%;
      height: 100px;
      padding: 0.8rem;
      background: rgba(35, 35, 40, 0.5);
      border: 1px solid rgba(160, 118, 249, 0.3);
      border-radius: 8px;
      color: #e0e0e0;
      resize: vertical;
      
      &:focus {
        outline: none;
        border-color: #A076F9;
        box-shadow: 0 0 0 2px rgba(160, 118, 249, 0.2);
      }
    }
  }
  
  .button-container {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
  }
`;

const StatsCard = styled(motion.div)`
  background: rgba(25, 25, 30, 0.8);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(50, 50, 60, 0.4);
  margin-bottom: 1rem;
  
  h3 {
    margin: 0 0 1rem;
    font-size: 1.2rem;
    color: #e0e0e0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      color: #A076F9;
    }
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.8rem;
    
    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: rgba(35, 35, 40, 0.5);
      padding: 0.8rem;
      border-radius: 8px;
      
      .stat-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.6rem;
        
        &.pending {
          background: rgba(255, 193, 7, 0.15);
          color: #FFC107;
        }
        
        &.completed {
          background: rgba(76, 175, 80, 0.15);
          color: #4CAF50;
        }
        
        &.late {
          background: rgba(244, 67, 54, 0.15);
          color: #F44336;
        }
        
        &.graded {
          background: rgba(33, 150, 243, 0.15);
          color: #2196F3;
        }
      }
      
      .stat-value {
        font-size: 1.3rem;
        font-weight: 600;
        color: #e0e0e0;
      }
      
      .stat-label {
        font-size: 0.8rem;
        color: #a0a0a0;
        text-align: center;
        margin-top: 0.2rem;
      }
    }
  }
`;

const ModalBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled(motion.div)`
  background: #19191e;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(160, 118, 249, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  
  h2 {
    margin-top: 0;
    color: #e0e0e0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      color: #A076F9;
    }
  }
  
  .form-group {
    margin-bottom: 1.5rem;
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #c0c0c0;
    }
    
    input, select, textarea {
      width: 100%;
      padding: 0.8rem;
      background: rgba(30, 30, 35, 0.6);
      border: 1px solid rgba(160, 118, 249, 0.3);
      border-radius: 8px;
      color: #e0e0e0;
      font-size: 0.9rem;
      
      &:focus {
        outline: none;
        border-color: #A076F9;
      }
    }
    
    textarea {
      min-height: 100px;
      resize: vertical;
    }
  }
  
  .form-row {
    display: flex;
    gap: 1rem;
    
    .form-group {
      flex: 1;
    }
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }
`;

// Sample assignment data
const assignmentsData = [
    {
        id: 1,
        title: "Research Paper on Artificial Intelligence",
        course: "Introduction to Computer Science",
        courseCode: "CS101",
        status: "pending",
        dueDate: "2025-07-25", // Two days from July 23, 2025
        assignedDate: "2025-07-15",
        instructor: "Dr. Sarah Johnson",
        points: 100,
        earnedPoints: 0,
        progress: 65,
        description: "Write a research paper discussing the current state of artificial intelligence and its future implications. Include sections on machine learning, neural networks, and potential ethical concerns.",
        attachments: [
            { name: "Research_Paper_Guidelines.pdf", type: "pdf", size: "1.2 MB" },
            { name: "AI_Research_Resources.docx", type: "doc", size: "824 KB" }
        ],
        submissionType: "Document upload",
        category: "Research Paper"
    },
    {
        id: 2,
        title: "Data Structures Implementation",
        course: "Data Structures and Algorithms",
        courseCode: "CS210",
        status: "submitted",
        dueDate: "2025-07-20", // Already passed from July 23, 2025
        assignedDate: "2025-07-05",
        submittedDate: "2025-07-19",
        instructor: "Prof. Michael Chen",
        points: 50,
        earnedPoints: 0,
        progress: 100,
        description: "Implement various data structures including linked lists, stacks, queues, and binary trees using a programming language of your choice. Include proper documentation and test cases.",
        attachments: [
            { name: "Data_Structures_Assignment.pdf", type: "pdf", size: "956 KB" }
        ],
        submission: {
            files: [{ name: "DataStructures_Implementation.zip", type: "zip", size: "1.8 MB" }],
            comment: "I've implemented all required data structures using Python with comprehensive documentation and test cases for each implementation."
        },
        submissionType: "Code submission",
        category: "Programming"
    },
    {
        id: 3,
        title: "Website Design Project",
        course: "Web Development Fundamentals",
        courseCode: "IT205",
        status: "graded",
        dueDate: "2025-07-10", // Already passed from July 23, 2025
        assignedDate: "2025-06-25",
        submittedDate: "2025-07-09",
        gradedDate: "2025-07-15",
        instructor: "Emma Rodriguez",
        points: 75,
        earnedPoints: 68,
        progress: 100,
        description: "Design and develop a responsive personal portfolio website using HTML, CSS, and JavaScript. The website should include home, about, portfolio, and contact sections.",
        attachments: [
            { name: "Website_Project_Requirements.pdf", type: "pdf", size: "1.1 MB" },
            { name: "Portfolio_Examples.zip", type: "zip", size: "3.5 MB" }
        ],
        submission: {
            files: [
                { name: "portfolio_project_code.zip", type: "zip", size: "2.2 MB" },
                { name: "website_screenshots.pdf", type: "pdf", size: "1.5 MB" }
            ],
            comment: "I've created a responsive portfolio website with all required sections. The site includes animations and works well on all device sizes."
        },
        feedback: "Great design and responsive implementation. The code is well-structured and commented. Could improve on the contact form validation and cross-browser compatibility.",
        submissionType: "Code + Documentation",
        category: "Project"
    },
    {
        id: 4,
        title: "SQL Database Design",
        course: "Database Systems",
        courseCode: "IS220",
        status: "late",
        dueDate: "2025-07-18", // Already passed from July 23, 2025
        assignedDate: "2025-07-05",
        submittedDate: "2025-07-21",
        instructor: "Dr. Robert Taylor",
        points: 50,
        earnedPoints: 0,
        progress: 100,
        description: "Design a relational database for a library management system. Include entity-relationship diagrams, SQL scripts for table creation, and sample queries for common operations.",
        attachments: [
            { name: "Database_Assignment_Instructions.pdf", type: "pdf", size: "875 KB" }
        ],
        submission: {
            files: [
                { name: "Library_DB_Design.pdf", type: "pdf", size: "1.3 MB" },
                { name: "SQL_Scripts.sql", type: "sql", size: "45 KB" }
            ],
            comment: "I apologize for the late submission. I've included comprehensive ER diagrams and all required SQL scripts for the library management system."
        },
        submissionType: "SQL + Documentation",
        category: "Database Design"
    },
    {
        id: 5,
        title: "Machine Learning Quiz",
        course: "Artificial Intelligence",
        courseCode: "CS350",
        status: "pending",
        dueDate: "2025-07-30", // Coming up from July 23, 2025
        assignedDate: "2025-07-20",
        instructor: "Dr. Lisa Wong",
        points: 25,
        earnedPoints: 0,
        progress: 0,
        description: "Complete the online quiz covering fundamental concepts of machine learning, including supervised and unsupervised learning, neural networks, and evaluation metrics.",
        submissionType: "Online Quiz",
        category: "Quiz"
    },
    {
        id: 6,
        title: "Mobile App Prototype",
        course: "Mobile App Development",
        courseCode: "SE310",
        status: "pending",
        dueDate: "2025-08-05", // Coming up from July 23, 2025
        assignedDate: "2025-07-15",
        instructor: "James Wilson",
        points: 100,
        earnedPoints: 0,
        progress: 30,
        description: "Design and develop a prototype mobile application for a fitness tracking system. Include wireframes, UI/UX design, and a working prototype using a framework of your choice.",
        attachments: [
            { name: "App_Prototype_Guidelines.pdf", type: "pdf", size: "1.5 MB" },
            { name: "UI_Kit_Resources.zip", type: "zip", size: "4.2 MB" }
        ],
        submissionType: "Prototype + Documentation",
        category: "Project"
    }
];

const Assignment = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [showFilter, setShowFilter] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("dueDate");
    const [sortDirection, setSortDirection] = useState("asc");
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [submissionComment, setSubmissionComment] = useState("");
    const [showStatistics, setShowStatistics] = useState(false);

    // Calculate statistics
    const stats = {
        pending: assignmentsData.filter(a => a.status === "pending").length,
        submitted: assignmentsData.filter(a => a.status === "submitted").length,
        late: assignmentsData.filter(a => a.status === "late").length,
        graded: assignmentsData.filter(a => a.status === "graded").length
    };

    // Get today's date
    const today = new Date("2025-07-23");

    // Filter and sort assignments
    const filteredAssignments = assignmentsData.filter(assignment => {
        // Filter by search term
        if (searchTerm && !assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !assignment.course.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }

        // Filter by tab
        if (activeTab === "pending" && assignment.status !== "pending") return false;
        if (activeTab === "submitted" && assignment.status !== "submitted") return false;
        if (activeTab === "late" && assignment.status !== "late") return false;
        if (activeTab === "graded" && assignment.status !== "graded") return false;

        // Filter by active filter
        if (activeFilter === "upcoming") {
            const dueDate = new Date(assignment.dueDate);
            return dueDate >= today && assignment.status === "pending";
        } else if (activeFilter === "overdue") {
            const dueDate = new Date(assignment.dueDate);
            return dueDate < today && assignment.status === "pending";
        } else if (activeFilter === "thisWeek") {
            const dueDate = new Date(assignment.dueDate);
            const oneWeekLater = new Date(today);
            oneWeekLater.setDate(today.getDate() + 7);
            return dueDate >= today && dueDate <= oneWeekLater;
        }

        return true;
    }).sort((a, b) => {
        // Sort logic
        if (sortOrder === "dueDate") {
            if (sortDirection === "asc") {
                return new Date(a.dueDate) - new Date(b.dueDate);
            } else {
                return new Date(b.dueDate) - new Date(a.dueDate);
            }
        } else if (sortOrder === "title") {
            if (sortDirection === "asc") {
                return a.title.localeCompare(b.title);
            } else {
                return b.title.localeCompare(a.title);
            }
        } else if (sortOrder === "course") {
            if (sortDirection === "asc") {
                return a.course.localeCompare(b.course);
            } else {
                return b.course.localeCompare(a.course);
            }
        } else if (sortOrder === "points") {
            if (sortDirection === "asc") {
                return a.points - b.points;
            } else {
                return b.points - a.points;
            }
        }

        return 0;
    });

    // Handle assignment selection
    const handleAssignmentSelect = (assignment) => {
        setSelectedAssignment(assignment);
    };

    // Check if assignment is due soon (within 3 days)
    const isDueSoon = (dueDate) => {
        const due = new Date(dueDate);
        const threeDaysFromNow = new Date(today);
        threeDaysFromNow.setDate(today.getDate() + 3);
        return due <= threeDaysFromNow && due >= today;
    };

    // Check if assignment is overdue
    const isOverdue = (dueDate) => {
        return new Date(dueDate) < today;
    };

    // Handle file upload
    const handleFileUpload = () => {
        // In a real app, this would open a file picker
        // For demo purposes, we'll simulate adding a file
        const newFile = {
            name: `Assignment_Submission_${Math.floor(Math.random() * 1000)}.pdf`,
            type: "pdf",
            size: "1.5 MB"
        };

        setUploadedFiles([...uploadedFiles, newFile]);
    };

    // Handle file deletion
    const handleFileDelete = (index) => {
        const newFiles = [...uploadedFiles];
        newFiles.splice(index, 1);
        setUploadedFiles(newFiles);
    };

    // Handle submission
    const handleSubmit = () => {
        // In a real app, this would submit the files and comment to the server
        // For demo purposes, we'll just update the local state
        if (selectedAssignment) {
            const updatedAssignments = assignmentsData.map(assignment => {
                if (assignment.id === selectedAssignment.id) {
                    return {
                        ...assignment,
                        status: "submitted",
                        submittedDate: "2025-07-23", // Today
                        progress: 100,
                        submission: {
                            files: uploadedFiles,
                            comment: submissionComment
                        }
                    };
                }
                return assignment;
            });

            // Update the selected assignment
            const updatedAssignment = updatedAssignments.find(a => a.id === selectedAssignment.id);
            setSelectedAssignment(updatedAssignment);

            // Close the modal
            setShowSubmitModal(false);
            setUploadedFiles([]);
            setSubmissionComment("");

            // In a real app, this would also update the server
        }
    };

    // Toggle sort direction
    const toggleSortDirection = () => {
        setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    };

    return (
        <AssignmentContainer>
            <GlobalStyles />

            <Header>
                <h1><FaClipboardList /> Assignments</h1>
                <ToolBar>
                    <SearchInputWrapper>
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search assignments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </SearchInputWrapper>

                    <div style={{ position: 'relative' }}>
                        <Button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setShowFilter(!showFilter)}
                        >
                            <FaFilter /> Filter: {activeFilter === 'all' ? 'All' : activeFilter}
                        </Button>

                        {showFilter && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    marginTop: '0.5rem',
                                    background: 'rgba(25, 25, 30, 0.95)',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    width: '180px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                                    border: '1px solid rgba(50, 50, 60, 0.4)',
                                    zIndex: 100
                                }}
                            >
                                {['all', 'upcoming', 'overdue', 'thisWeek'].map((filter) => (
                                    <div
                                        key={filter}
                                        onClick={() => {
                                            setActiveFilter(filter);
                                            setShowFilter(false);
                                        }}
                                        style={{
                                            padding: '0.8rem 1rem',
                                            cursor: 'pointer',
                                            backgroundColor: activeFilter === filter ? 'rgba(160, 118, 249, 0.15)' : 'transparent',
                                            borderBottom: '1px solid rgba(50, 50, 60, 0.4)',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {filter === 'all' ? 'All Assignments' :
                                            filter === 'upcoming' ? 'Upcoming Due Dates' :
                                                filter === 'overdue' ? 'Overdue' :
                                                    filter === 'thisWeek' ? 'Due This Week' :
                                                        filter.charAt(0).toUpperCase() + filter.slice(1)}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    <Button
                        onClick={toggleSortDirection}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {sortDirection === "asc" ? <FaSortAmountDown /> : <FaSortAmountUp />}
                        Sort: {sortOrder.charAt(0).toUpperCase() + sortOrder.slice(1)}
                    </Button>
                </ToolBar>
            </Header>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
            }}>
                <TabsContainer style={{ marginBottom: '0' }}>
                    <Tab active={activeTab === "all"} onClick={() => setActiveTab("all")}>
                        <FaClipboardList /> All Assignments
                    </Tab>
                    <Tab active={activeTab === "pending"} onClick={() => setActiveTab("pending")}>
                        <FaHourglassHalf /> Pending ({stats.pending})
                    </Tab>
                    <Tab active={activeTab === "submitted"} onClick={() => setActiveTab("submitted")}>
                        <FaCheckCircle /> Submitted ({stats.submitted})
                    </Tab>
                    <Tab active={activeTab === "late"} onClick={() => setActiveTab("late")}>
                        <FaExclamationTriangle /> Late ({stats.late})
                    </Tab>
                    <Tab active={activeTab === "graded"} onClick={() => setActiveTab("graded")}>
                        <FaChartBar /> Graded ({stats.graded})
                    </Tab>
                </TabsContainer>

                <Button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowStatistics(!showStatistics)}
                    style={{ marginLeft: '10px' }}
                >
                    <FaChartBar /> {showStatistics ? 'Hide Stats' : 'Show Stats'}
                </Button>
            </div>

            {showStatistics && (
                <StatsCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    <h3><FaChartBar /> Assignment Statistics</h3>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-icon pending">
                                <FaHourglassHalf />
                            </div>
                            <div className="stat-value">{stats.pending}</div>
                            <div className="stat-label">Pending</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-icon completed">
                                <FaCheckCircle />
                            </div>
                            <div className="stat-value">{stats.submitted}</div>
                            <div className="stat-label">Submitted</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-icon late">
                                <FaExclamationTriangle />
                            </div>
                            <div className="stat-value">{stats.late}</div>
                            <div className="stat-label">Late</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-icon graded">
                                <FaChartBar />
                            </div>
                            <div className="stat-value">{stats.graded}</div>
                            <div className="stat-label">Graded</div>
                        </div>
                    </div>
                </StatsCard>
            )}

            <ContentWrapper>
                <AssignmentList>
                    {filteredAssignments.map(assignment => (
                        <AssignmentCard
                            key={assignment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => handleAssignmentSelect(assignment)}
                            style={{
                                borderLeft: selectedAssignment && selectedAssignment.id === assignment.id ?
                                    '4px solid #A076F9' : '1px solid rgba(50, 50, 60, 0.4)'
                            }}
                        >
                            <div className="card-header">
                                <div className="title-section">
                                    <h3>
                                        <FaFileAlt /> {assignment.title}
                                    </h3>
                                    <div className="course-name">
                                        <FaBook /> {assignment.course} ({assignment.courseCode})
                                    </div>
                                </div>

                                <div className={`status-badge ${assignment.status}`}>
                                    {assignment.status === "pending" && <FaHourglassHalf />}
                                    {assignment.status === "submitted" && <FaCheckCircle />}
                                    {assignment.status === "late" && <FaExclamationTriangle />}
                                    {assignment.status === "graded" && <FaChartBar />}

                                    {assignment.status === "pending" && "Pending"}
                                    {assignment.status === "submitted" && "Submitted"}
                                    {assignment.status === "late" && "Late"}
                                    {assignment.status === "graded" && "Graded"}
                                </div>
                            </div>

                            <div className="card-content">
                                <div className="info-section">
                                    <div className={`info-item ${isDueSoon(assignment.dueDate) ? 'deadline-soon' :
                                        isOverdue(assignment.dueDate) ? 'overdue' : ''}`}>
                                        <FaCalendarAlt /> Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                        {isDueSoon(assignment.dueDate) && " (Soon)"}
                                        {isOverdue(assignment.dueDate) && assignment.status === "pending" && " (Overdue)"}
                                    </div>

                                    <div className="info-item">
                                        <FaChalkboardTeacher /> {assignment.instructor}
                                    </div>

                                    <div className="info-item">
                                        <FaTags /> {assignment.category}
                                    </div>
                                </div>

                                <div className="action-buttons">
                                    <button onClick={(e) => { e.stopPropagation(); }}>
                                        <FaEye />
                                    </button>
                                    {assignment.status === "pending" && (
                                        <button onClick={(e) => { e.stopPropagation(); setShowSubmitModal(true); setSelectedAssignment(assignment); }}>
                                            <FaFileUpload />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="progress-section">
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${assignment.progress}%` }}
                                    ></div>
                                </div>
                                <div className="progress-info">
                                    <div className="progress-percent">{assignment.progress}% Complete</div>
                                    <div>{assignment.points} Points</div>
                                </div>
                            </div>
                        </AssignmentCard>
                    ))}

                    {filteredAssignments.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem',
                            color: '#a0a0a0',
                            background: 'rgba(25, 25, 30, 0.8)',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(50, 50, 60, 0.4)',
                        }}>
                            <FaClipboardList style={{ fontSize: '3rem', color: '#A076F9', marginBottom: '1rem' }} />
                            <h2>No assignments found</h2>
                            <p>Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </AssignmentList>

                <AssignmentDetailSection>
                    {selectedAssignment ? (
                        <>
                            <AssignmentDetail
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h3><FaClipboardList /> Assignment Details</h3>

                                <div className="detail-section">
                                    <h4>{selectedAssignment.title}</h4>
                                    <div className="detail-list">
                                        <div className="detail-item">
                                            <FaBook /> Course: {selectedAssignment.course} ({selectedAssignment.courseCode})
                                        </div>
                                        <div className="detail-item">
                                            <FaChalkboardTeacher /> Instructor: {selectedAssignment.instructor}
                                        </div>
                                        <div className={`detail-item ${isDueSoon(selectedAssignment.dueDate) ? 'highlight' : ''}`}>
                                            <FaCalendarAlt /> Due Date: {new Date(selectedAssignment.dueDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <div className="detail-item">
                                            <FaCalendarAlt /> Assigned: {new Date(selectedAssignment.assignedDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        {selectedAssignment.submittedDate && (
                                            <div className="detail-item">
                                                <FaCheckCircle /> Submitted: {new Date(selectedAssignment.submittedDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        )}
                                        {selectedAssignment.gradedDate && (
                                            <div className="detail-item">
                                                <FaChartBar /> Graded: {new Date(selectedAssignment.gradedDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        )}
                                        <div className="detail-item">
                                            <FaTags /> Category: {selectedAssignment.category}
                                        </div>
                                        <div className="detail-item">
                                            <FaFileUpload /> Submission Type: {selectedAssignment.submissionType}
                                        </div>
                                        <div className="detail-item highlight">
                                            <FaChartBar /> Points: {selectedAssignment.earnedPoints > 0 ?
                                                `${selectedAssignment.earnedPoints}/${selectedAssignment.points}` :
                                                `${selectedAssignment.points} possible`}
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h4>Description</h4>
                                    <p>{selectedAssignment.description}</p>
                                </div>

                                {selectedAssignment.attachments && selectedAssignment.attachments.length > 0 && (
                                    <div className="detail-section">
                                        <h4>Attachments</h4>
                                        <div className="file-attachments">
                                            {selectedAssignment.attachments.map((attachment, index) => (
                                                <div className="attachment" key={index}>
                                                    <div className="file-info">
                                                        <FaFileAlt />
                                                        <div className="file-name">{attachment.name} ({attachment.size})</div>
                                                    </div>
                                                    <div className="download-btn">
                                                        <FaDownload />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedAssignment.status === "graded" && selectedAssignment.feedback && (
                                    <div className="detail-section">
                                        <h4>Instructor Feedback</h4>
                                        <p>{selectedAssignment.feedback}</p>
                                    </div>
                                )}

                                <div className="button-container">
                                    {selectedAssignment.status === "pending" && (
                                        <Button primary whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowSubmitModal(true)}>
                                            <FaFileUpload /> Submit Assignment
                                        </Button>
                                    )}
                                    <Button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                        <FaDownload /> Download Materials
                                    </Button>
                                </div>
                            </AssignmentDetail>

                            {(selectedAssignment.status === "submitted" || selectedAssignment.status === "late" || selectedAssignment.status === "graded") && (
                                <AssignmentSubmission>
                                    <h3><FaCheckCircle /> Your Submission</h3>

                                    <div className="detail-section">
                                        <h4>Submitted Files</h4>
                                        <div className="file-attachments">
                                            {selectedAssignment.submission.files.map((file, index) => (
                                                <div className="attachment" key={index}>
                                                    <div className="file-info">
                                                        <FaFileAlt />
                                                        <div className="file-name">{file.name} ({file.size})</div>
                                                    </div>
                                                    <div className="download-btn">
                                                        <FaDownload />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedAssignment.submission.comment && (
                                        <div className="detail-section">
                                            <h4>Your Comment</h4>
                                            <p>{selectedAssignment.submission.comment}</p>
                                        </div>
                                    )}

                                    {selectedAssignment.status !== "graded" && (
                                        <div className="button-container">
                                            <Button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                                <FaEdit /> Edit Submission
                                            </Button>
                                        </div>
                                    )}
                                </AssignmentSubmission>
                            )}
                        </>
                    ) : (
                        <AssignmentDetail
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h3><FaClipboardList /> Assignment Details</h3>
                            <p style={{ color: '#a0a0a0', textAlign: 'center', margin: '2rem 0' }}>
                                Select an assignment to view details
                            </p>
                        </AssignmentDetail>
                    )}
                </AssignmentDetailSection>
            </ContentWrapper>

            {/* Submit Modal */}
            {showSubmitModal && selectedAssignment && (
                <ModalBackdrop
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowSubmitModal(false)}
                >
                    <ModalContent
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2><FaFileUpload /> Submit Assignment</h2>

                        <div className="form-group">
                            <label>Assignment</label>
                            <input
                                type="text"
                                value={selectedAssignment.title}
                                disabled
                            />
                        </div>

                        <div className="upload-area" onClick={handleFileUpload}>
                            <FaFileUpload />
                            <p>Click to upload files or <strong>drag & drop</strong> them here</p>
                            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                                Accepted file types: PDF, DOC, DOCX, ZIP (Max: 20MB)
                            </p>
                        </div>

                        {uploadedFiles.length > 0 && (
                            <div className="uploaded-files">
                                {uploadedFiles.map((file, index) => (
                                    <div className="file-item" key={index}>
                                        <div className="file-info">
                                            <FaFileAlt />
                                            <div className="file-name">{file.name} ({file.size})</div>
                                        </div>
                                        <div className="file-actions">
                                            <button className="delete" onClick={() => handleFileDelete(index)}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="comment">Comment (Optional)</label>
                            <textarea
                                id="comment"
                                value={submissionComment}
                                onChange={(e) => setSubmissionComment(e.target.value)}
                                placeholder="Add a comment about your submission..."
                            />
                        </div>

                        <div className="modal-actions">
                            <Button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setShowSubmitModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                primary
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleSubmit}
                                disabled={uploadedFiles.length === 0}
                                style={{ opacity: uploadedFiles.length === 0 ? 0.7 : 1 }}
                            >
                                <FaPaperPlane /> Submit
                            </Button>
                        </div>
                    </ModalContent>
                </ModalBackdrop>
            )}
        </AssignmentContainer>
    );
};

export default Assignment;
