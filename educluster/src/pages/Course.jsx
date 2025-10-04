import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";
import {
  FaBook,
  FaSearch,
  FaFilter,
  FaChartBar,
  FaClock,
  FaStar,
  FaRegStar,
  FaMapMarkerAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaClipboardList,
  FaVideo,
  FaFileAlt,
  FaLaptop,
  FaPlus,
  FaAngleRight,
  FaAngleDown,
  FaAngleLeft,
  FaPlayCircle,
  FaFileDownload,
  FaLock,
  FaUnlock,
  FaGraduationCap,
} from "react-icons/fa";
import { API } from "../utils/api";

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

const CourseContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #121214;
  color: #e0e0e0;
  padding: 1rem;
  max-width: 100%;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

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
    min-width: fit-content;

    svg {
      color: #a076f9;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
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
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Button = styled(motion.button)`
  padding: ${(props) => (props.small ? "0.4rem 0.8rem" : "0.6rem 1.2rem")};
  background: ${(props) =>
    props.primary
      ? "linear-gradient(135deg, #A076F9, #7E57C2)"
      : "rgba(30, 30, 35, 0.6)"};
  color: ${(props) => (props.primary ? "white" : "#d0d0d0")};
  border: ${(props) =>
    props.primary ? "none" : "1px solid rgba(160, 118, 249, 0.3)"};
  border-radius: 50px;
  cursor: pointer;
  font-size: ${(props) => (props.small ? "0.8rem" : "0.9rem")};
  font-weight: ${(props) => (props.primary ? "600" : "400")};
  display: flex;
  align-items: center;
  gap: ${(props) => (props.small ? "0.4rem" : "0.6rem")};
  box-shadow: ${(props) =>
    props.primary ? "0 4px 15px rgba(126, 87, 194, 0.3)" : "none"};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${(props) =>
      props.primary
        ? "0 6px 20px rgba(126, 87, 194, 0.4)"
        : "0 4px 12px rgba(0, 0, 0, 0.2)"};
    background: ${(props) =>
      props.primary
        ? "linear-gradient(135deg, #b18aff, #9065db)"
        : "rgba(40, 40, 45, 0.6)"};
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  max-width: 300px;
  width: 100%;
  min-width: 200px;

  @media (max-width: 768px) {
    max-width: 100%;
    min-width: auto;
  }

  input {
    width: 100%;
    padding: 0.6rem 1rem 0.6rem 2.5rem;
    border-radius: 50px;
    background: rgba(30, 30, 35, 0.6);
    border: 1px solid rgba(160, 118, 249, 0.2);
    color: #e0e0e0;
    font-size: 0.9rem;
    box-sizing: border-box;

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
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(50, 50, 60, 0.4);
  padding: 0.25rem 0 0.5rem 0;
  overflow-x: auto;
  flex-wrap: nowrap;
  width: 100%;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(160, 118, 249, 0.3);
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    gap: 0.3rem;
    padding: 0.25rem 0 0.5rem 0;
  }
`;

const Tab = styled(motion.button)`
  padding: 0.6rem 1.2rem;
  background: ${(props) =>
    props.active ? "rgba(160, 118, 249, 0.15)" : "transparent"};
  color: ${(props) => (props.active ? "#A076F9" : "#a0a0a0")};
  border: ${(props) =>
    props.active ? "2px solid #A076F9" : "2px solid transparent"};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: fit-content;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }

  &:hover {
    background: rgba(160, 118, 249, 0.1);
    color: ${(props) => (props.active ? "#A076F9" : "#d0d0d0")};
    border-color: ${(props) =>
      props.active ? "#A076F9" : "rgba(160, 118, 249, 0.3)"};
  }
`;

const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
  margin-bottom: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const CourseCard = styled(motion.div)`
  background: rgba(25, 25, 30, 0.8);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(50, 50, 60, 0.4);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    border-color: rgba(160, 118, 249, 0.3);
  }

  .course-image {
    height: 160px;
    background-size: cover;
    background-position: center;
    position: relative;

    .course-type {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: rgba(0, 0, 0, 0.7);
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      color: #e0e0e0;
      display: flex;
      align-items: center;
      gap: 0.3rem;

      svg {
        color: #a076f9;
      }
    }

    .favorite {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(0, 0, 0, 0.5);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      svg {
        color: ${(props) => (props.favorite ? "#FFD700" : "#d0d0d0")};
      }
    }
  }

  .course-content {
    padding: 1.5rem;

    h3 {
      margin: 0 0 0.8rem 0;
      font-size: 1.2rem;
      color: #e0e0e0;
    }

    .course-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;

      .detail-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #a0a0a0;
        font-size: 0.9rem;

        svg {
          color: #a076f9;
          font-size: 0.9rem;
        }
      }
    }

    .progress-bar {
      height: 6px;
      background: rgba(50, 50, 60, 0.4);
      border-radius: 3px;
      margin-top: 1rem;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        background: linear-gradient(135deg, #a076f9, #7e57c2);
        border-radius: 3px;
      }
    }

    .progress-text {
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
      font-size: 0.85rem;

      .progress-percent {
        color: #a076f9;
        font-weight: 600;
      }

      .lessons-count {
        color: #a0a0a0;
      }
    }
  }
`;

const CourseDetailContainer = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const CourseDetailMain = styled.div`
  flex: 1;
  min-width: 0;
`;

const CourseSidebar = styled.div`
  width: 300px;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const CourseHeader = styled.div`
  background: rgba(25, 25, 30, 0.8);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(50, 50, 60, 0.4);

  h2 {
    margin: 0 0 1rem 0;
    font-size: 1.8rem;
    color: #e0e0e0;
    display: flex;
    align-items: center;
    gap: 0.8rem;

    svg {
      color: #a076f9;
    }
  }

  .header-meta {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #a0a0a0;

      svg {
        color: #a076f9;
      }
    }
  }

  .course-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 1rem;

    .tag {
      background: rgba(160, 118, 249, 0.1);
      color: #a076f9;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
    }
  }

  .button-container {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }
`;

const CourseContent = styled.div`
  background: rgba(25, 25, 30, 0.8);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(50, 50, 60, 0.4);

  h3 {
    margin: 0 0 1.5rem 0;
    font-size: 1.4rem;
    color: #e0e0e0;
  }

  .content-section {
    margin-bottom: 1rem;
    border-bottom: 1px solid rgba(50, 50, 60, 0.4);
    padding-bottom: 1rem;

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.8rem;
      background: rgba(30, 30, 35, 0.6);
      border-radius: 8px;
      cursor: pointer;
      margin-bottom: 0.8rem;

      .header-left {
        display: flex;
        align-items: center;
        gap: 0.8rem;

        h4 {
          margin: 0;
          font-size: 1.1rem;
        }
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 1rem;

        .section-length {
          font-size: 0.9rem;
          color: #a0a0a0;
        }
      }
    }

    .section-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0 0.5rem;

      .content-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.8rem;
        border-radius: 8px;
        background: rgba(35, 35, 40, 0.5);
        transition: all 0.2s ease;

        &:hover {
          background: rgba(40, 40, 45, 0.8);
        }

        .item-left {
          display: flex;
          align-items: center;
          gap: 0.8rem;

          .item-icon {
            color: #a076f9;
          }

          .item-title {
            font-size: 1rem;
          }
        }

        .item-right {
          display: flex;
          align-items: center;
          gap: 1rem;

          .item-length {
            font-size: 0.9rem;
            color: #a0a0a0;
          }

          .item-status {
            color: ${(props) => (props.completed ? "#4CAF50" : "#a0a0a0")};
            font-size: 0.9rem;
          }

          .item-lock {
            color: ${(props) => (props.locked ? "#FF5555" : "#4CAF50")};
          }
        }
      }
    }
  }
`;

const CourseInfoSidebar = styled.div`
  background: rgba(25, 25, 30, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(50, 50, 60, 0.4);
  position: sticky;
  top: 1.5rem;

  .video-preview {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 1.5rem;
    position: relative;
    cursor: pointer;

    img {
      width: 100%;
      height: auto;
      display: block;
    }

    .play-button {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;

      svg {
        color: #a076f9;
        font-size: 1.8rem;
      }

      &:hover {
        transform: translate(-50%, -50%) scale(1.1);
        background: rgba(0, 0, 0, 0.8);

        svg {
          color: #b18aff;
        }
      }
    }
  }

  h3 {
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
  }

  .info-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;

    .info-item {
      display: flex;
      align-items: center;
      gap: 0.8rem;

      svg {
        color: #a076f9;
      }
    }
  }

  .button-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const ProgressBarContainer = styled.div`
  background: rgba(25, 25, 30, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(50, 50, 60, 0.4);

  h3 {
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
      color: #a076f9;
    }
  }

  .progress-circle {
    width: 120px;
    height: 120px;
    margin: 0 auto 1.5rem;
    position: relative;

    .progress-background {
      fill: none;
      stroke: rgba(50, 50, 60, 0.4);
      stroke-width: 10;
    }

    .progress-fill {
      fill: none;
      stroke: url(#gradient);
      stroke-width: 10;
      stroke-linecap: round;
      transform: rotate(-90deg);
      transform-origin: center;
      transition: stroke-dashoffset 0.5s ease;
    }

    .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.5rem;
      font-weight: bold;
      color: #a076f9;
    }
  }

  .progress-details {
    display: flex;
    justify-content: space-around;

    .detail-item {
      text-align: center;

      .detail-value {
        font-size: 1.2rem;
        font-weight: 600;
        color: #e0e0e0;
      }

      .detail-label {
        font-size: 0.9rem;
        color: #a0a0a0;
        margin-top: 0.3rem;
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(160, 118, 249, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  margin: 1rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
    width: 95%;
    max-width: none;
  }

  h2 {
    margin-top: 0;
    color: #e0e0e0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;

    @media (max-width: 768px) {
      font-size: 1.3rem;
    }

    svg {
      color: #a076f9;
    }
  }

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #c0c0c0;
      font-weight: 500;
    }

    input,
    select,
    textarea {
      width: 100%;
      padding: 0.8rem;
      background: rgba(30, 30, 35, 0.6);
      border: 1px solid rgba(160, 118, 249, 0.3);
      border-radius: 8px;
      color: #e0e0e0;
      font-size: 0.9rem;
      box-sizing: border-box;
      transition: border-color 0.2s ease;

      &:focus {
        outline: none;
        border-color: #a076f9;
        box-shadow: 0 0 0 2px rgba(160, 118, 249, 0.1);
      }

      &::placeholder {
        color: #808080;
      }
    }

    textarea {
      min-height: 100px;
      resize: vertical;
      font-family: inherit;
    }

    select {
      cursor: pointer;
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
    padding-top: 1rem;
    border-top: 1px solid rgba(50, 50, 60, 0.4);

    @media (max-width: 768px) {
      justify-content: stretch;

      button {
        flex: 1;
      }
    }
  }
`;

// Course data
const courses = [
  {
    id: 1,
    title: "Introduction to Computer Science",
    instructor: "Dr. Sarah Johnson",
    department: "Computer Science",
    level: "Beginner",
    duration: "12 weeks",
    startDate: "July 15, 2025",
    progress: 35,
    image:
      "https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books_23-2149331952.jpg?size=626&ext=jpg&ga=GA1.1.386372595.1698192000&semt=sph",
    type: "Core",
    lessons: 24,
    completedLessons: 8,
    favorite: true,
    credits: 4,
    description:
      "This course provides a comprehensive introduction to the fundamental concepts of computer science, covering algorithms, data structures, programming basics, and computational thinking.",
  },
  {
    id: 2,
    title: "Data Structures and Algorithms",
    instructor: "Prof. Michael Chen",
    department: "Computer Science",
    level: "Intermediate",
    duration: "10 weeks",
    startDate: "August 1, 2025",
    progress: 20,
    image:
      "https://img.freepik.com/free-vector/big-data-analytics-abstract-concept-illustration_335657-2127.jpg?size=626&ext=jpg&ga=GA1.1.386372595.1698192000&semt=ais",
    type: "Core",
    lessons: 20,
    completedLessons: 4,
    favorite: false,
    credits: 4,
    description:
      "Learn about efficient data organization and algorithm design. Topics include arrays, linked lists, trees, sorting algorithms, searching algorithms, and algorithmic complexity.",
  },
  {
    id: 3,
    title: "Web Development Fundamentals",
    instructor: "Emma Rodriguez",
    department: "Information Technology",
    level: "Beginner",
    duration: "8 weeks",
    startDate: "July 20, 2025",
    progress: 60,
    image:
      "https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg?size=626&ext=jpg&ga=GA1.1.386372595.1698192000&semt=sph",
    type: "Elective",
    lessons: 16,
    completedLessons: 10,
    favorite: true,
    credits: 3,
    description:
      "An introduction to modern web development including HTML5, CSS3, and JavaScript. Students will build responsive websites and learn about web standards and best practices.",
  },
  {
    id: 4,
    title: "Database Systems",
    instructor: "Dr. Robert Taylor",
    department: "Information Systems",
    level: "Intermediate",
    duration: "10 weeks",
    startDate: "August 5, 2025",
    progress: 10,
    image:
      "https://img.freepik.com/free-vector/server-room-rack-blockchain-technology-token-api-access-data-center_39422-442.jpg?size=626&ext=jpg&ga=GA1.1.386372595.1698192000&semt=ais",
    type: "Core",
    lessons: 18,
    completedLessons: 2,
    favorite: false,
    credits: 4,
    description:
      "Explore the principles and practices of database management systems, including relational database design, SQL querying, transaction processing, and database administration.",
  },
  {
    id: 5,
    title: "Artificial Intelligence",
    instructor: "Dr. Lisa Wong",
    department: "Computer Science",
    level: "Advanced",
    duration: "14 weeks",
    startDate: "September 1, 2025",
    progress: 0,
    image:
      "https://img.freepik.com/free-vector/brain-with-digital-circuit-artificial-intelligence_107791-1523.jpg?size=626&ext=jpg&ga=GA1.1.386372595.1698192000&semt=ais",
    type: "Elective",
    lessons: 28,
    completedLessons: 0,
    favorite: true,
    credits: 4,
    description:
      "An introduction to AI concepts including problem solving, knowledge representation, planning, machine learning, natural language processing, and neural networks.",
  },
  {
    id: 6,
    title: "Mobile App Development",
    instructor: "James Wilson",
    department: "Software Engineering",
    level: "Intermediate",
    duration: "12 weeks",
    startDate: "August 15, 2025",
    progress: 0,
    image:
      "https://img.freepik.com/free-vector/app-development-concept-illustration_114360-5164.jpg?size=626&ext=jpg&ga=GA1.1.386372595.1698192000&semt=ais",
    type: "Elective",
    lessons: 24,
    completedLessons: 0,
    favorite: false,
    credits: 3,
    description:
      "Learn to design and build mobile applications for iOS and Android platforms using modern frameworks and development environments.",
  },
];

// Course content for detailed view
const courseContent = [
  {
    id: 1,
    title: "Introduction to Programming",
    lessons: [
      {
        id: 1,
        title: "What is Programming?",
        type: "video",
        duration: "10:25",
        completed: true,
        locked: false,
      },
      {
        id: 2,
        title: "Setting Up Your Environment",
        type: "video",
        duration: "15:40",
        completed: true,
        locked: false,
      },
      {
        id: 3,
        title: "Your First Program",
        type: "practice",
        duration: "20:15",
        completed: false,
        locked: false,
      },
      {
        id: 4,
        title: "Programming Concepts Quiz",
        type: "quiz",
        duration: "15:00",
        completed: false,
        locked: false,
      },
    ],
  },
  {
    id: 2,
    title: "Variables and Data Types",
    lessons: [
      {
        id: 5,
        title: "Understanding Variables",
        type: "video",
        duration: "12:10",
        completed: true,
        locked: false,
      },
      {
        id: 6,
        title: "Data Types Overview",
        type: "video",
        duration: "14:30",
        completed: true,
        locked: false,
      },
      {
        id: 7,
        title: "Working with Numbers",
        type: "video",
        duration: "09:45",
        completed: true,
        locked: false,
      },
      {
        id: 8,
        title: "Working with Strings",
        type: "video",
        duration: "11:20",
        completed: true,
        locked: false,
      },
      {
        id: 9,
        title: "Variables and Data Types Exercise",
        type: "practice",
        duration: "25:00",
        completed: true,
        locked: false,
      },
    ],
  },
  {
    id: 3,
    title: "Control Flow",
    lessons: [
      {
        id: 10,
        title: "Conditional Statements",
        type: "video",
        duration: "13:55",
        completed: true,
        locked: false,
      },
      {
        id: 11,
        title: "Loops and Iterations",
        type: "video",
        duration: "16:30",
        completed: true,
        locked: false,
      },
      {
        id: 12,
        title: "Switch Statements",
        type: "video",
        duration: "08:40",
        completed: false,
        locked: false,
      },
      {
        id: 13,
        title: "Control Flow Challenges",
        type: "practice",
        duration: "30:00",
        completed: false,
        locked: false,
      },
    ],
  },
  {
    id: 4,
    title: "Functions and Methods",
    lessons: [
      {
        id: 14,
        title: "Introduction to Functions",
        type: "video",
        duration: "14:15",
        completed: false,
        locked: false,
      },
      {
        id: 15,
        title: "Parameters and Return Values",
        type: "video",
        duration: "12:50",
        completed: false,
        locked: false,
      },
      {
        id: 16,
        title: "Function Scope",
        type: "video",
        duration: "10:30",
        completed: false,
        locked: false,
      },
      {
        id: 17,
        title: "Anonymous Functions",
        type: "video",
        duration: "09:25",
        completed: false,
        locked: true,
      },
      {
        id: 18,
        title: "Functions Exercise",
        type: "practice",
        duration: "35:00",
        completed: false,
        locked: true,
      },
    ],
  },
  {
    id: 5,
    title: "Introduction to Algorithms",
    lessons: [
      {
        id: 19,
        title: "What is an Algorithm?",
        type: "video",
        duration: "11:30",
        completed: false,
        locked: true,
      },
      {
        id: 20,
        title: "Algorithm Complexity",
        type: "video",
        duration: "15:20",
        completed: false,
        locked: true,
      },
      {
        id: 21,
        title: "Common Algorithms",
        type: "video",
        duration: "18:45",
        completed: false,
        locked: true,
      },
      {
        id: 22,
        title: "Algorithm Design Exercise",
        type: "practice",
        duration: "40:00",
        completed: false,
        locked: true,
      },
    ],
  },
];

const Course = ({ user }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedSections, setExpandedSections] = useState([1, 2]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Course creation state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [newCourse, setNewCourse] = useState({
    name: "",
    code: "",
    description: "",
    credits: "",
    semester: "",
    departmentId: "",
    facultyId: "",
  });

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, [user]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilter && !event.target.closest("[data-filter-dropdown]")) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const userId = user?.id || user?.enrollmentNo;
      const response = await API.courses.getCourses(
        userId,
        user?.role?.toUpperCase()
      );

      // Transform API data to match component expectations
      const transformedCourses = response.courses.map((course) => ({
        id: course.id,
        title: course.name,
        instructor: course.faculty
          ? `${course.faculty.user.firstName} ${course.faculty.user.lastName}`
          : "TBA",
        department: course.department?.name || "General",
        type: course.semester <= 4 ? "undergraduate" : "graduate",
        duration: `${course.credits} Credits`,
        rating: 4.5, // Mock rating
        students: course.enrollments?.length || 0,
        level:
          course.semester <= 2
            ? "Beginner"
            : course.semester <= 6
            ? "Intermediate"
            : "Advanced",
        language: "English",
        price: "Free",
        thumbnail: "/api/placeholder/300/200", // Placeholder image
        tags: [course.code, course.department?.name],
        progress: Math.floor(Math.random() * 101), // Mock progress
        favorite: false, // Mock favorite status
        lastAccessed: new Date().toLocaleDateString(),
        totalHours: course.credits * 15, // Approximate hours
        completedHours: Math.floor(Math.random() * course.credits * 15),
        description:
          course.description || `Comprehensive course on ${course.name}`,
        prerequisites: [],
        courseCode: course.code,
        schedule: `${course.credits} hours per week`,
        nextDeadline: "Assignment due in 3 days",
      }));

      setCourses(transformedCourses);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollInCourse = async (courseId) => {
    try {
      const userId = user?.id || user?.enrollmentNo;
      await API.courses.enrollInCourse(userId, courseId);
      alert("Successfully enrolled in course!");
      fetchCourses(); // Refresh courses
    } catch (err) {
      console.error("Error enrolling in course:", err);
      alert("Failed to enroll in course. Please try again.");
    }
  };

  // Fetch departments for course creation
  const fetchDepartments = async () => {
    try {
      console.log("Fetching departments...");

      // Test API connectivity
      const testResponse = await fetch("http://localhost:3001/api/departments");
      console.log(
        "Departments API test:",
        testResponse.status,
        testResponse.ok
      );

      const response = await API.departments.getDepartments();
      console.log("Departments response:", response);

      const deptData = response.departments || response.data || [];
      console.log("Setting departments:", deptData);
      setDepartments(deptData);

      if (deptData.length === 0) {
        console.log("No departments received, setting mock data");
        setDepartments([
          { id: "1", name: "Computer Science" },
          { id: "2", name: "Mathematics" },
          { id: "3", name: "Physics" },
          { id: "4", name: "Engineering" },
          { id: "5", name: "Business" },
        ]);
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
      // Fallback to mock data if API fails
      setDepartments([
        { id: "1", name: "Computer Science" },
        { id: "2", name: "Mathematics" },
        { id: "3", name: "Physics" },
        { id: "4", name: "Engineering" },
        { id: "5", name: "Business" },
      ]);
    }
  };

  // Fetch faculty for course creation
  const fetchFaculty = async () => {
    try {
      console.log("Fetching faculty...");

      // Test API connectivity
      const testResponse = await fetch("http://localhost:3001/api/faculty");
      console.log("Faculty API test:", testResponse.status, testResponse.ok);

      const response = await API.faculty.getFaculty();
      console.log("Faculty response:", response);

      const facultyData = response.faculty || response.data || [];
      console.log("Setting faculty:", facultyData);
      setFaculty(facultyData);

      if (facultyData.length === 0) {
        console.log("No faculty received, setting mock data");
        setFaculty([
          { id: "1", user: { firstName: "John", lastName: "Doe" } },
          { id: "2", user: { firstName: "Jane", lastName: "Smith" } },
          { id: "3", user: { firstName: "Mike", lastName: "Johnson" } },
        ]);
      }
    } catch (err) {
      console.error("Error fetching faculty:", err);
      // Fallback to mock data if API fails
      setFaculty([
        { id: "1", user: { firstName: "John", lastName: "Doe" } },
        { id: "2", user: { firstName: "Jane", lastName: "Smith" } },
        { id: "3", user: { firstName: "Mike", lastName: "Johnson" } },
      ]);
    }
  };

  // Fetch additional data for course creation (HOD/Principal only)
  useEffect(() => {
    console.log("Course useEffect triggered with user:", user);
    // Force fetching for testing - remove role check temporarily
    if (user) {
      console.log("Calling fetchDepartments and fetchFaculty...");
      fetchDepartments();
      fetchFaculty();
    } else {
      console.log("No user found, setting mock data");
      setDepartments([
        { id: "1", name: "Computer Science" },
        { id: "2", name: "Mathematics" },
        { id: "3", name: "Physics" },
        { id: "4", name: "Engineering" },
        { id: "5", name: "Business" },
      ]);
      setFaculty([
        { id: "1", user: { firstName: "John", lastName: "Doe" } },
        { id: "2", user: { firstName: "Jane", lastName: "Smith" } },
        { id: "3", user: { firstName: "Mike", lastName: "Johnson" } },
      ]);
    }
  }, [user]);

  // Handle course creation form input
  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({
      ...newCourse,
      [name]: value,
    });
  };

  // Create new course
  const handleCreateCourse = async () => {
    try {
      // Validate required fields
      if (
        !newCourse.name ||
        !newCourse.code ||
        !newCourse.description ||
        !newCourse.credits ||
        !newCourse.semester
      ) {
        setError("Please fill in all required fields");
        return;
      }

      const userId = user?.id || user?.enrollmentNo;
      const courseData = {
        name: newCourse.name,
        code: newCourse.code,
        description: newCourse.description,
        credits: parseInt(newCourse.credits),
        semester: parseInt(newCourse.semester),
        departmentId: newCourse.departmentId || null,
        facultyId: newCourse.facultyId || null,
        createdBy: userId,
      };

      await API.courses.createCourse(courseData);

      // Reset form and close modal
      setNewCourse({
        name: "",
        code: "",
        description: "",
        credits: "",
        semester: "",
        departmentId: "",
        facultyId: "",
      });
      setShowCreateModal(false);
      setError("");

      // Refresh courses
      fetchCourses();
    } catch (err) {
      console.error("Error creating course:", err);
      setError("Failed to create course. Please try again.");
    }
  };

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter((id) => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  // Filter courses based on activeTab
  const filteredCourses = courses.filter((course) => {
    // Filter by tab
    if (
      activeTab !== "all" &&
      course.type.toLowerCase() !== activeTab.toLowerCase()
    ) {
      return false;
    }

    // Filter by search term
    if (
      searchTerm &&
      !course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !course.department.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filter by active filter
    if (activeFilter === "in-progress") {
      return course.progress > 0 && course.progress < 100;
    } else if (activeFilter === "completed") {
      return course.progress === 100;
    } else if (activeFilter === "not-started") {
      return course.progress === 0;
    } else if (activeFilter === "favorites") {
      return course.favorite;
    }

    return true;
  });

  // Handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
  };

  // Go back to course list
  const handleBackToCourses = () => {
    setSelectedCourse(null);
  };

  // Toggle favorite status
  const toggleFavorite = (e, courseId) => {
    e.stopPropagation();
    const updatedCourses = courses.map((course) => {
      if (course.id === courseId) {
        return { ...course, favorite: !course.favorite };
      }
      return course;
    });
    // In a real app, this would update the state/database
  };

  return (
    <CourseContainer>
      <GlobalStyles />

      <Header>
        <h1>
          <FaBook /> Courses
        </h1>
        {!selectedCourse && (
          <ToolBar>
            {["HOD", "PRINCIPAL"].includes(user?.role?.toUpperCase()) && (
              <Button
                primary
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowCreateModal(true)}
              >
                <FaPlus /> Create Course
              </Button>
            )}

            <SearchInputWrapper>
              <FaSearch />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchInputWrapper>

            <div style={{ position: "relative" }} data-filter-dropdown>
              <Button
                small
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowFilter(!showFilter)}
              >
                <FaFilter /> Filter
              </Button>

              {showFilter && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: "0.5rem",
                    background: "rgba(25, 25, 30, 0.95)",
                    borderRadius: "8px",
                    overflow: "hidden",
                    width: "180px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                    border: "1px solid rgba(50, 50, 60, 0.4)",
                    zIndex: 100,
                  }}
                >
                  {[
                    { key: "all", label: "All Courses" },
                    { key: "in-progress", label: "In Progress" },
                    { key: "completed", label: "Completed" },
                    { key: "not-started", label: "Not Started" },
                    { key: "favorites", label: "Favorites" },
                  ].map(({ key, label }) => (
                    <div
                      key={key}
                      onClick={() => {
                        setActiveFilter(key);
                        setShowFilter(false);
                      }}
                      style={{
                        padding: "0.8rem 1rem",
                        cursor: "pointer",
                        backgroundColor:
                          activeFilter === key
                            ? "rgba(160, 118, 249, 0.15)"
                            : "transparent",
                        borderBottom: "1px solid rgba(50, 50, 60, 0.4)",
                        transition: "all 0.2s ease",
                        color: activeFilter === key ? "#a076f9" : "#e0e0e0",
                      }}
                      onMouseEnter={(e) => {
                        if (activeFilter !== key) {
                          e.target.style.backgroundColor =
                            "rgba(160, 118, 249, 0.05)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeFilter !== key) {
                          e.target.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </ToolBar>
        )}

        {selectedCourse && (
          <Button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleBackToCourses}
          >
            <FaAngleLeft /> Back to Courses
          </Button>
        )}
      </Header>

      {!selectedCourse ? (
        <>
          <TabsContainer>
            <Tab
              active={activeTab === "all"}
              onClick={() => setActiveTab("all")}
            >
              All Courses
            </Tab>
            <Tab
              active={activeTab === "core"}
              onClick={() => setActiveTab("core")}
            >
              Core
            </Tab>
            <Tab
              active={activeTab === "elective"}
              onClick={() => setActiveTab("elective")}
            >
              Elective
            </Tab>
            <Tab
              active={activeTab === "specialization"}
              onClick={() => setActiveTab("specialization")}
            >
              Specialization
            </Tab>
          </TabsContainer>

          <CourseGrid>
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                favorite={course.favorite}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleCourseSelect(course)}
              >
                <div
                  className="course-image"
                  style={{ backgroundImage: `url(${course.image})` }}
                >
                  <div className="course-type">
                    {course.type === "Core" && <FaBook />}
                    {course.type === "Elective" && <FaLaptop />}
                    {course.type === "Specialization" && <FaChartBar />}
                    {course.type}
                  </div>
                  <div
                    className="favorite"
                    onClick={(e) => toggleFavorite(e, course.id)}
                  >
                    {course.favorite ? <FaStar /> : <FaRegStar />}
                  </div>
                </div>
                <div className="course-content">
                  <h3>{course.title}</h3>
                  <div className="course-details">
                    <div className="detail-item">
                      <FaChalkboardTeacher /> {course.instructor}
                    </div>
                    <div className="detail-item">
                      <FaCalendarAlt /> {course.startDate}
                    </div>
                    <div className="detail-item">
                      <FaClock /> {course.duration}
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    <span className="progress-percent">
                      {course.progress}% Complete
                    </span>
                    <span className="lessons-count">
                      {course.completedLessons}/{course.lessons} Lessons
                    </span>
                  </div>
                </div>
              </CourseCard>
            ))}
          </CourseGrid>

          {filteredCourses.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "#a0a0a0",
                maxWidth: "400px",
                margin: "0 auto",
              }}
            >
              <FaBook
                style={{
                  fontSize: "3rem",
                  color: "#A076F9",
                  marginBottom: "1rem",
                }}
              />
              <h2 style={{ margin: "1rem 0", color: "#e0e0e0" }}>
                No courses found
              </h2>
              <p style={{ margin: 0, lineHeight: 1.5 }}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </>
      ) : (
        <CourseDetailContainer>
          <CourseDetailMain>
            <CourseHeader>
              <h2>
                <FaBook /> {selectedCourse.title}
              </h2>
              <div className="header-meta">
                <div className="meta-item">
                  <FaChalkboardTeacher /> Instructor:{" "}
                  {selectedCourse.instructor}
                </div>
                <div className="meta-item">
                  <FaUserGraduate /> Department: {selectedCourse.department}
                </div>
                <div className="meta-item">
                  <FaChartBar /> Level: {selectedCourse.level}
                </div>
                <div className="meta-item">
                  <FaClock /> Duration: {selectedCourse.duration}
                </div>
                <div className="meta-item">
                  <FaGraduationCap /> Credits: {selectedCourse.credits}
                </div>
              </div>
              <p>{selectedCourse.description}</p>
              <div className="course-tags">
                <span className="tag">{selectedCourse.type}</span>
                <span className="tag">{selectedCourse.department}</span>
                <span className="tag">{selectedCourse.level}</span>
              </div>
              <div className="button-container">
                <Button
                  primary
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <FaPlayCircle /> Continue Learning
                </Button>
                <Button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <FaFileDownload /> Download Materials
                </Button>
              </div>
            </CourseHeader>

            <CourseContent>
              <h3>Course Content</h3>

              {courseContent.map((section) => (
                <div key={section.id} className="content-section">
                  <div
                    className="section-header"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="header-left">
                      {expandedSections.includes(section.id) ? (
                        <FaAngleDown />
                      ) : (
                        <FaAngleRight />
                      )}
                      <h4>
                        Section {section.id}: {section.title}
                      </h4>
                    </div>
                    <div className="header-right">
                      <div className="section-length">
                        {section.lessons.length} lessons
                      </div>
                    </div>
                  </div>

                  {expandedSections.includes(section.id) && (
                    <div className="section-content">
                      {section.lessons.map((lesson) => (
                        <div key={lesson.id} className="content-item">
                          <div className="item-left">
                            <div className="item-icon">
                              {lesson.type === "video" && <FaVideo />}
                              {lesson.type === "practice" && <FaLaptop />}
                              {lesson.type === "quiz" && <FaClipboardList />}
                            </div>
                            <div className="item-title">{lesson.title}</div>
                          </div>
                          <div className="item-right">
                            <div className="item-length">{lesson.duration}</div>
                            {lesson.locked ? (
                              <div className="item-lock">
                                <FaLock />
                              </div>
                            ) : (
                              <div className="item-lock">
                                <FaUnlock />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CourseContent>
          </CourseDetailMain>

          <CourseSidebar>
            <CourseInfoSidebar>
              <div className="video-preview">
                <img src={selectedCourse.image} alt={selectedCourse.title} />
                <div className="play-button">
                  <FaPlayCircle />
                </div>
              </div>

              <h3>Course Information</h3>
              <div className="info-list">
                <div className="info-item">
                  <FaCalendarAlt /> Start Date: {selectedCourse.startDate}
                </div>
                <div className="info-item">
                  <FaClock /> Duration: {selectedCourse.duration}
                </div>
                <div className="info-item">
                  <FaGraduationCap /> Credits: {selectedCourse.credits}
                </div>
                <div className="info-item">
                  <FaChartBar /> Level: {selectedCourse.level}
                </div>
                <div className="info-item">
                  <FaMapMarkerAlt /> Location: Online
                </div>
              </div>

              <div className="button-container">
                <Button
                  primary
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <FaPlayCircle /> Start Next Lesson
                </Button>
                <Button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <FaCalendarAlt /> Course Schedule
                </Button>
              </div>
            </CourseInfoSidebar>

            <ProgressBarContainer>
              <h3>
                <FaChartBar /> Your Progress
              </h3>

              <svg width="120" height="120" className="progress-circle">
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#A076F9" />
                    <stop offset="100%" stopColor="#7E57C2" />
                  </linearGradient>
                </defs>
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  className="progress-background"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  className="progress-fill"
                  strokeDasharray="314"
                  strokeDashoffset={314 - (314 * selectedCourse.progress) / 100}
                />
                <text
                  x="60"
                  y="60"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="progress-text"
                >
                  {selectedCourse.progress}%
                </text>
              </svg>

              <div className="progress-details">
                <div className="detail-item">
                  <div className="detail-value">
                    {selectedCourse.completedLessons}
                  </div>
                  <div className="detail-label">Completed</div>
                </div>
                <div className="detail-item">
                  <div className="detail-value">{selectedCourse.lessons}</div>
                  <div className="detail-label">Total Lessons</div>
                </div>
                <div className="detail-item">
                  <div className="detail-value">
                    {selectedCourse.lessons - selectedCourse.completedLessons}
                  </div>
                  <div className="detail-label">Remaining</div>
                </div>
              </div>
            </ProgressBarContainer>
          </CourseSidebar>
        </CourseDetailContainer>
      )}

      {/* Create Course Modal */}
      {showCreateModal && (
        <ModalBackdrop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowCreateModal(false)}
        >
          <ModalContent
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>
              <FaPlus /> Create New Course
            </h2>

            {error && (
              <div
                style={{
                  background: "rgba(255, 0, 0, 0.1)",
                  border: "1px solid rgba(255, 0, 0, 0.3)",
                  borderRadius: "8px",
                  padding: "0.75rem",
                  marginBottom: "1rem",
                  color: "#ff6b6b",
                }}
              >
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="course-name">Course Name *</label>
              <input
                type="text"
                id="course-name"
                name="name"
                value={newCourse.name}
                onChange={handleCreateInputChange}
                placeholder="Enter course name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="course-code">Course Code *</label>
                <input
                  type="text"
                  id="course-code"
                  name="code"
                  value={newCourse.code}
                  onChange={handleCreateInputChange}
                  placeholder="e.g., CS101"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="course-credits">Credits *</label>
                <input
                  type="number"
                  id="course-credits"
                  name="credits"
                  value={newCourse.credits}
                  onChange={handleCreateInputChange}
                  placeholder="Enter credits"
                  min="1"
                  max="6"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="course-description">Description *</label>
              <textarea
                id="course-description"
                name="description"
                value={newCourse.description}
                onChange={handleCreateInputChange}
                placeholder="Enter course description"
                rows="4"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: "rgba(30, 30, 35, 0.5)",
                  border: "1px solid rgba(50, 50, 60, 0.3)",
                  borderRadius: "8px",
                  color: "#e0e0e0",
                  fontSize: "0.9rem",
                  resize: "vertical",
                }}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="course-semester">Semester *</label>
                <select
                  id="course-semester"
                  name="semester"
                  value={newCourse.semester}
                  onChange={handleCreateInputChange}
                  required
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="course-department">Department</label>
                <select
                  id="course-department"
                  name="departmentId"
                  value={newCourse.departmentId}
                  onChange={handleCreateInputChange}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="course-faculty">Assign Faculty</label>
              <select
                id="course-faculty"
                name="facultyId"
                value={newCourse.facultyId}
                onChange={handleCreateInputChange}
              >
                <option value="">Select Faculty</option>
                {faculty.map((fac) => (
                  <option key={fac.id} value={fac.id}>
                    {fac.user
                      ? `${fac.user.firstName} ${fac.user.lastName}`
                      : `Faculty ${fac.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-actions">
              <Button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setShowCreateModal(false);
                  setError("");
                  setNewCourse({
                    name: "",
                    code: "",
                    description: "",
                    credits: "",
                    semester: "",
                    departmentId: "",
                    facultyId: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                primary
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCreateCourse}
                disabled={
                  !newCourse.name ||
                  !newCourse.code ||
                  !newCourse.description ||
                  !newCourse.credits ||
                  !newCourse.semester
                }
              >
                Create Course
              </Button>
            </div>
          </ModalContent>
        </ModalBackdrop>
      )}
    </CourseContainer>
  );
};

export default Course;
