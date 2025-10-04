import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
  FaFilter,
  FaChartBar,
  FaDownload,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaStar,
  FaClock,
  FaBook,
  FaChartLine,
  FaChevronDown,
  FaChevronUp,
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

const GradesContainer = styled.div`
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
  flex-wrap: wrap;

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
    margin-right: 1.5rem;
    white-space: nowrap;

    svg {
      color: #a076f9;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
    margin-bottom: 1.5rem;
  }
`;

const ToolBar = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  min-height: 60px;
  padding: 0.5rem 0;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
    gap: 1rem;
    margin-top: 0.5rem;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    min-height: 50px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.8rem;
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  max-width: 320px;
  width: 100%;
  flex-shrink: 1;
  margin-right: 1rem;

  input {
    width: 100%;
    padding: 0.7rem 1rem 0.7rem 2.8rem;
    border-radius: 50px;
    background: rgba(30, 30, 35, 0.8);
    border: 1px solid rgba(160, 118, 249, 0.3);
    color: #e0e0e0;
    font-size: 0.9rem;
    height: 42px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: rgba(160, 118, 249, 0.6);
      box-shadow: 0 0 0 3px rgba(160, 118, 249, 0.2);
      background: rgba(35, 35, 40, 0.9);
    }

    &::placeholder {
      color: #909090;
    }
  }

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #909090;
    font-size: 1.1rem;
    transition: color 0.3s ease;
  }

  &:focus-within svg {
    color: #a076f9;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    margin-right: 0;
    margin-bottom: 0;
    flex-basis: auto;
  }

  @media (max-width: 480px) {
    margin-bottom: 0.8rem;
    width: 100%;
  }
`;

const Button = styled(motion.button)`
  padding: 0.7rem 1.4rem;
  background: ${(props) =>
    props.primary
      ? "linear-gradient(135deg, #A076F9, #7E57C2)"
      : "rgba(30, 30, 35, 0.8)"};
  color: ${(props) => (props.primary ? "white" : "#e0e0e0")};
  border: ${(props) =>
    props.primary ? "none" : "1px solid rgba(160, 118, 249, 0.4)"};
  border-radius: 50px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: ${(props) => (props.primary ? "600" : "500")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  box-shadow: ${(props) =>
    props.primary
      ? "0 4px 15px rgba(126, 87, 194, 0.3)"
      : "0 4px 8px rgba(0, 0, 0, 0.2)"};
  transition: all 0.3s ease;
  min-width: ${(props) => (props.icon ? "44px" : "130px")};
  height: 42px;
  flex-shrink: 0;
  margin: 0;
  white-space: nowrap;
  overflow: visible;
  position: relative;
  z-index: 1;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${(props) =>
      props.primary
        ? "0 6px 20px rgba(126, 87, 194, 0.4)"
        : "0 6px 15px rgba(0, 0, 0, 0.25)"};
    background: ${(props) =>
      props.primary
        ? "linear-gradient(135deg, #b18aff, #9065db)"
        : "rgba(45, 45, 50, 0.9)"};
    border-color: ${(props) =>
      props.primary ? "none" : "rgba(160, 118, 249, 0.6)"};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    min-width: ${(props) => (props.icon ? "40px" : "110px")};
    padding: 0.7rem ${(props) => (props.icon ? "0.9rem" : "1.2rem")};
    font-size: 0.85rem;
    height: 40px;
  }

  @media (max-width: 480px) {
    min-width: ${(props) => (props.icon ? "38px" : "100px")};
    padding: 0.6rem ${(props) => (props.icon ? "0.8rem" : "1rem")};
    font-size: 0.8rem;
    height: 38px;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(50, 50, 60, 0.4);
  padding: 0.5rem 0 1rem 0;
  overflow: visible;
  flex-wrap: wrap;
  width: 100%;
  justify-content: flex-start;
  align-items: center;

  @media (max-width: 768px) {
    gap: 0.8rem;
    padding: 0.5rem 0 1.2rem 0;
    margin-bottom: 1rem;
    justify-content: center;
  }

  @media (max-width: 480px) {
    gap: 0.6rem;
    justify-content: flex-start;
  }
`;

const Tab = styled(motion.button)`
  padding: 0.8rem 1.6rem;
  background: ${(props) =>
    props.active ? "rgba(160, 118, 249, 0.15)" : "rgba(30, 30, 35, 0.8)"};
  color: ${(props) => (props.active ? "#A076F9" : "#b0b0b0")};
  border: ${(props) =>
    props.active ? "2px solid #A076F9" : "2px solid rgba(160, 118, 249, 0.2)"};
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: ${(props) => (props.active ? "600" : "500")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: fit-content;
  margin: 0.2rem;
  box-shadow: ${(props) =>
    props.active
      ? "0 4px 15px rgba(160, 118, 249, 0.2)"
      : "0 2px 8px rgba(0, 0, 0, 0.1)"};
  box-sizing: border-box;
  position: relative;
  flex-shrink: 0;

  &:hover {
    background: ${(props) =>
      props.active ? "rgba(160, 118, 249, 0.25)" : "rgba(45, 45, 50, 0.9)"};
    color: ${(props) => (props.active ? "#A076F9" : "#e0e0e0")};
    border-color: ${(props) =>
      props.active ? "#A076F9" : "rgba(160, 118, 249, 0.4)"};
    transform: translateY(-1px);
    box-shadow: ${(props) =>
      props.active
        ? "0 6px 20px rgba(160, 118, 249, 0.25)"
        : "0 4px 12px rgba(0, 0, 0, 0.15)"};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.7rem 1.3rem;
    font-size: 0.85rem;
    margin: 0.15rem;
    flex: 1;
    min-width: 120px;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
    margin: 0.1rem;
    min-width: 100px;
    flex: 1;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  min-height: 42px;

  @media (max-width: 768px) {
    gap: 0.8rem;
    width: 100%;
    justify-content: flex-start;
  }

  @media (max-width: 480px) {
    gap: 0.6rem;
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 2rem;
  padding: 0.5rem 0;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const MainContent = styled.div`
  flex: 1;
`;

const GradeCard = styled(motion.div)`
  background: rgba(25, 25, 30, 0.8);
  border-radius: 12px;
  margin-bottom: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(50, 50, 60, 0.4);
  transition: all 0.3s ease;
`;

const GradeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(50, 50, 60, 0.4);

  .course-info {
    .course-name {
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0 0 0.3rem 0;
      color: #e0e0e0;
    }

    .course-code {
      font-size: 0.9rem;
      color: #a0a0a0;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      svg {
        color: #a076f9;
      }
    }
  }

  .grade-display {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .grade-value {
      font-size: 1.8rem;
      font-weight: 700;
      background: linear-gradient(135deg, #a076f9, #7e57c2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.2rem;
    }

    .grade-percentage {
      font-size: 0.9rem;
      color: #a0a0a0;
    }
  }
`;

const GradeContent = styled.div`
  padding: 0 1.5rem;

  &.collapsed {
    height: 0;
    padding: 0;
    overflow: hidden;
  }
`;

const ExpandButton = styled.button`
  width: 100%;
  padding: 0.7rem 0;
  background: transparent;
  border: none;
  border-top: 1px solid rgba(50, 50, 60, 0.4);
  color: #a0a0a0;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(160, 118, 249, 0.05);
    color: #a076f9;
  }

  &:active {
    background: rgba(160, 118, 249, 0.1);
  }
`;

const AssignmentTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;

  th,
  td {
    padding: 0.8rem;
    text-align: left;
    border-bottom: 1px solid rgba(50, 50, 60, 0.4);
  }

  th {
    color: #a0a0a0;
    font-weight: 500;
    font-size: 0.85rem;
  }

  td {
    font-size: 0.9rem;
  }

  .score-cell {
    text-align: center;
  }

  .status-cell {
    text-align: center;

    .status {
      padding: 0.3rem 0.6rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;

      &.completed {
        background: rgba(76, 175, 80, 0.15);
        color: #4caf50;
      }

      &.pending {
        background: rgba(255, 193, 7, 0.15);
        color: #ffc107;
      }

      &.missed {
        background: rgba(244, 67, 54, 0.15);
        color: #f44336;
      }
    }
  }
`;

const SidebarWrapper = styled.div`
  width: 300px;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(25, 25, 30, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(50, 50, 60, 0.4);

  h3 {
    font-size: 1.1rem;
    color: #e0e0e0;
    margin: 0 0 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
      color: #a076f9;
    }
  }
`;

const GradeDistribution = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-top: 1rem;

  .grade-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .label {
      width: 30px;
      font-weight: 600;
      text-align: center;
    }

    .bar-wrapper {
      flex: 1;
      height: 6px;
      background: rgba(50, 50, 60, 0.4);
      border-radius: 3px;
      overflow: hidden;

      .bar {
        height: 100%;
        background: linear-gradient(90deg, #a076f9, #7e57c2);
        border-radius: 3px;
        transition: width 1s ease;
      }
    }

    .count {
      width: 30px;
      font-size: 0.8rem;
      color: #a0a0a0;
      text-align: right;
    }
  }
`;

const GradePercentage = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;

  .grade-stat {
    background: rgba(30, 30, 35, 0.6);
    padding: 0.8rem 1rem;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: calc(50% - 0.5rem);

    .value {
      font-size: 1.3rem;
      font-weight: 600;
      color: #e0e0e0;
      display: flex;
      align-items: center;
      gap: 0.4rem;

      &.positive {
        color: #4caf50;
      }

      &.negative {
        color: #f44336;
      }

      &.neutral {
        color: #a076f9;
      }
    }

    .label {
      font-size: 0.8rem;
      color: #a0a0a0;
      margin-top: 0.3rem;
    }
  }
`;

const GradeProgressCard = styled(StatCard)`
  .progress-section {
    margin-bottom: 1.5rem;

    &:last-child {
      margin-bottom: 0;
    }

    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;

      .title {
        font-size: 0.9rem;
        color: #c0c0c0;
      }

      .value {
        font-size: 0.9rem;
        color: #a076f9;
      }
    }

    .progress-bar {
      height: 6px;
      background: rgba(50, 50, 60, 0.4);
      border-radius: 3px;
      overflow: hidden;

      .bar {
        height: 100%;
        background: linear-gradient(90deg, #a076f9, #7e57c2);
        border-radius: 3px;
      }
    }
  }
`;

const ActivityChart = styled.div`
  height: 100px;
  display: flex;
  align-items: flex-end;
  gap: 5px;
  margin: 1.5rem 0 0.5rem;

  .bar {
    flex: 1;
    background: linear-gradient(180deg, #a076f9 0%, #7e57c2 100%);
    border-radius: 3px 3px 0 0;
    transition: height 0.5s ease;

    &.inactive {
      background: rgba(50, 50, 60, 0.4);
    }
  }
`;

const ActivityLabels = styled.div`
  display: flex;
  justify-content: space-between;

  .label {
    font-size: 0.75rem;
    color: #a0a0a0;
    text-align: center;
    flex: 1;
  }
`;

// Sample courses data
const coursesData = [
  {
    id: 1,
    name: "Advanced Mathematics",
    code: "MATH301",
    grade: "A",
    percentage: 92,
    assignments: [
      {
        id: 1,
        name: "Calculus Assignment 1",
        dueDate: "2025-06-10",
        score: "48/50",
        percentage: 96,
        status: "completed",
      },
      {
        id: 2,
        name: "Linear Algebra Quiz",
        dueDate: "2025-06-15",
        score: "28/30",
        percentage: 93,
        status: "completed",
      },
      {
        id: 3,
        name: "Midterm Examination",
        dueDate: "2025-06-25",
        score: "88/100",
        percentage: 88,
        status: "completed",
      },
      {
        id: 4,
        name: "Differential Equations Project",
        dueDate: "2025-07-30",
        score: "N/A",
        percentage: null,
        status: "pending",
      },
    ],
    professor: "Dr. Sarah Miller",
  },
  {
    id: 2,
    name: "Introduction to Programming",
    code: "CS101",
    grade: "A+",
    percentage: 98,
    assignments: [
      {
        id: 1,
        name: "Hello World Program",
        dueDate: "2025-06-05",
        score: "10/10",
        percentage: 100,
        status: "completed",
      },
      {
        id: 2,
        name: "Variables and Data Types",
        dueDate: "2025-06-12",
        score: "20/20",
        percentage: 100,
        status: "completed",
      },
      {
        id: 3,
        name: "Control Structures",
        dueDate: "2025-06-20",
        score: "19/20",
        percentage: 95,
        status: "completed",
      },
      {
        id: 4,
        name: "Arrays and Functions",
        dueDate: "2025-06-27",
        score: "28/30",
        percentage: 93,
        status: "completed",
      },
      {
        id: 5,
        name: "Final Project",
        dueDate: "2025-07-15",
        score: "97/100",
        percentage: 97,
        status: "completed",
      },
    ],
    professor: "Prof. Michael Chen",
  },
  {
    id: 3,
    name: "World History",
    code: "HIST201",
    grade: "B+",
    percentage: 87,
    assignments: [
      {
        id: 1,
        name: "Ancient Civilizations Essay",
        dueDate: "2025-06-08",
        score: "45/50",
        percentage: 90,
        status: "completed",
      },
      {
        id: 2,
        name: "Medieval Europe Quiz",
        dueDate: "2025-06-18",
        score: "18/25",
        percentage: 72,
        status: "completed",
      },
      {
        id: 3,
        name: "Industrial Revolution Presentation",
        dueDate: "2025-06-22",
        score: "92/100",
        percentage: 92,
        status: "completed",
      },
      {
        id: 4,
        name: "World War II Analysis",
        dueDate: "2025-07-02",
        score: "43/50",
        percentage: 86,
        status: "completed",
      },
      {
        id: 5,
        name: "Modern History Research Paper",
        dueDate: "2025-07-20",
        score: "N/A",
        percentage: null,
        status: "pending",
      },
    ],
    professor: "Dr. James Wilson",
  },
  {
    id: 4,
    name: "Organic Chemistry",
    code: "CHEM302",
    grade: "C",
    percentage: 75,
    assignments: [
      {
        id: 1,
        name: "Nomenclature Quiz",
        dueDate: "2025-06-07",
        score: "15/20",
        percentage: 75,
        status: "completed",
      },
      {
        id: 2,
        name: "Reaction Mechanisms",
        dueDate: "2025-06-14",
        score: "25/30",
        percentage: 83,
        status: "completed",
      },
      {
        id: 3,
        name: "Lab Report: Synthesis",
        dueDate: "2025-06-21",
        score: "N/A",
        percentage: null,
        status: "missed",
      },
      {
        id: 4,
        name: "Stereochemistry Assignment",
        dueDate: "2025-06-30",
        score: "18/25",
        percentage: 72,
        status: "completed",
      },
      {
        id: 5,
        name: "Final Examination",
        dueDate: "2025-07-10",
        score: "70/100",
        percentage: 70,
        status: "completed",
      },
    ],
    professor: "Prof. Emma Rodriguez",
  },
];

// Sample grade distribution for statistics
const gradeDistribution = {
  "A+": 3,
  A: 5,
  "A-": 4,
  "B+": 7,
  B: 10,
  "B-": 6,
  "C+": 5,
  C: 4,
  "C-": 2,
  D: 1,
  F: 0,
};

// Sample activities data
const activitiesData = [60, 45, 75, 40, 80, 90, 65];
const activityLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Grades = ({ user }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [expandedCourses, setExpandedCourses] = useState({});
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch grades on component mount
  useEffect(() => {
    fetchGrades();
  }, [user]);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const response = await API.grades.getGrades(user?.id);

      // Group grades by course and transform data
      const courseGrades = {};
      response.grades.forEach((grade) => {
        const courseId = grade.assignment.course.id;
        const courseName = grade.assignment.course.name;

        if (!courseGrades[courseId]) {
          courseGrades[courseId] = {
            id: courseId,
            name: courseName,
            code: grade.assignment.course.code || "N/A",
            instructor: grade.assignment.faculty
              ? `${grade.assignment.faculty.user.firstName} ${grade.assignment.faculty.user.lastName}`
              : "TBA",
            credits: grade.assignment.course.credits || 3,
            assignments: [],
            totalMarks: 0,
            totalMaxMarks: 0,
          };
        }

        courseGrades[courseId].assignments.push({
          id: grade.id,
          title: grade.assignment.title,
          marks: grade.marks,
          maxMarks: grade.assignment.maxMarks,
          submittedAt: grade.submittedAt,
          gradedAt: grade.gradedAt,
          feedback: grade.feedback,
        });

        courseGrades[courseId].totalMarks += grade.marks;
        courseGrades[courseId].totalMaxMarks += grade.assignment.maxMarks;
      });

      // Calculate grades and percentages
      const transformedGrades = Object.values(courseGrades).map((course) => {
        const percentage =
          course.totalMaxMarks > 0
            ? Math.round((course.totalMarks / course.totalMaxMarks) * 100)
            : 0;

        let grade = "F";
        if (percentage >= 90) grade = "A";
        else if (percentage >= 80) grade = "B";
        else if (percentage >= 70) grade = "C";
        else if (percentage >= 60) grade = "D";

        return {
          ...course,
          percentage,
          grade,
          status: "Completed",
          trend: "stable", // You can implement trend calculation
        };
      });

      setGrades(transformedGrades);
    } catch (err) {
      console.error("Error fetching grades:", err);
      setError("Failed to load grades. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Toggle expanded state of a course
  const toggleCourseExpanded = (courseId) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  // Calculate overall GPA
  const calculateGPA = () => {
    const gradePoints = {
      "A+": 4.0,
      A: 4.0,
      "A-": 3.7,
      "B+": 3.3,
      B: 3.0,
      "B-": 2.7,
      "C+": 2.3,
      C: 2.0,
      "C-": 1.7,
      "D+": 1.3,
      D: 1.0,
      F: 0.0,
    };

    const totalPoints = grades.reduce(
      (sum, course) => sum + gradePoints[course.grade],
      0
    );
    return grades.length > 0
      ? (totalPoints / grades.length).toFixed(2)
      : "0.00";
  };

  // Calculate overall percentage
  const calculateAveragePercentage = () => {
    const totalPercentage = grades.reduce(
      (sum, course) => sum + course.percentage,
      0
    );
    return grades.length > 0
      ? (totalPercentage / grades.length).toFixed(1)
      : "0.0";
  };

  // Filter and sort courses
  const filteredCourses = grades
    .filter((course) => {
      if (
        searchTerm &&
        !course.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !course.code.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      if (activeTab === "highGrades" && course.percentage < 90) return false;
      if (activeTab === "lowGrades" && course.percentage >= 70) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortOrder === "grade") {
        const gradeOrder = [
          "A+",
          "A",
          "A-",
          "B+",
          "B",
          "B-",
          "C+",
          "C",
          "C-",
          "D+",
          "D",
          "D-",
          "F",
        ];
        const indexA = gradeOrder.indexOf(a.grade);
        const indexB = gradeOrder.indexOf(b.grade);
        return sortDirection === "asc" ? indexA - indexB : indexB - indexA;
      } else if (sortOrder === "percentage") {
        return sortDirection === "asc"
          ? a.percentage - b.percentage
          : b.percentage - a.percentage;
      }
      return 0;
    });

  return (
    <GradesContainer>
      <GlobalStyles />

      <Header>
        <h1>
          <FaGraduationCap /> Grades
        </h1>
        <ToolBar>
          <SearchInputWrapper>
            <FaSearch />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInputWrapper>

          <ButtonGroup>
            <Button
              onClick={() =>
                setSortOrder(sortOrder === "name" ? "percentage" : "name")
              }
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Change sort order"
            >
              Sort:{" "}
              {sortOrder === "name"
                ? "Name"
                : sortOrder === "grade"
                ? "Grade"
                : "%"}
            </Button>

            <Button
              icon
              onClick={toggleSortDirection}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              aria-label={`Sort ${
                sortDirection === "asc" ? "ascending" : "descending"
              }`}
            >
              {sortDirection === "asc" ? (
                <FaSortAmountDown />
              ) : (
                <FaSortAmountUp />
              )}
            </Button>
          </ButtonGroup>

          <Button
            primary
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Export grades"
          >
            <FaDownload /> Export
          </Button>
        </ToolBar>
      </Header>

      <TabsContainer>
        <Tab active={activeTab === "all"} onClick={() => setActiveTab("all")}>
          All Grades
        </Tab>
        <Tab
          active={activeTab === "highGrades"}
          onClick={() => setActiveTab("highGrades")}
        >
          <FaCheckCircle /> High Grades (A & A+)
        </Tab>
        <Tab
          active={activeTab === "lowGrades"}
          onClick={() => setActiveTab("lowGrades")}
        >
          <FaExclamationCircle /> Needs Improvement (Below C)
        </Tab>
      </TabsContainer>

      <ContentWrapper>
        <MainContent>
          {filteredCourses.map((course) => (
            <GradeCard
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GradeHeader>
                <div className="course-info">
                  <h3 className="course-name">{course.name}</h3>
                  <div className="course-code">
                    <FaBook /> {course.code} • {course.professor}
                  </div>
                </div>
                <div className="grade-display">
                  <div className="grade-value">{course.grade}</div>
                  <div className="grade-percentage">{course.percentage}%</div>
                </div>
              </GradeHeader>

              <GradeContent
                className={!expandedCourses[course.id] ? "collapsed" : ""}
              >
                <AssignmentTable>
                  <thead>
                    <tr>
                      <th>Assignment</th>
                      <th>Due Date</th>
                      <th className="score-cell">Score</th>
                      <th className="status-cell">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.assignments.map((assignment) => (
                      <tr key={assignment.id}>
                        <td>{assignment.name}</td>
                        <td>
                          {new Date(assignment.dueDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </td>
                        <td className="score-cell">
                          {assignment.score}
                          {assignment.percentage !== null &&
                            ` (${assignment.percentage}%)`}
                        </td>
                        <td className="status-cell">
                          <div className={`status ${assignment.status}`}>
                            {assignment.status === "completed" && (
                              <FaCheckCircle />
                            )}
                            {assignment.status === "pending" && <FaClock />}
                            {assignment.status === "missed" && (
                              <FaTimesCircle />
                            )}
                            {assignment.status.charAt(0).toUpperCase() +
                              assignment.status.slice(1)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </AssignmentTable>
              </GradeContent>

              <ExpandButton onClick={() => toggleCourseExpanded(course.id)}>
                {expandedCourses[course.id] ? (
                  <>
                    <FaChevronUp /> Hide Details
                  </>
                ) : (
                  <>
                    <FaChevronDown /> Show Details
                  </>
                )}
              </ExpandButton>
            </GradeCard>
          ))}

          {filteredCourses.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "#a0a0a0",
                background: "rgba(25, 25, 30, 0.8)",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                border: "1px solid rgba(50, 50, 60, 0.4)",
              }}
            >
              <FaGraduationCap
                style={{
                  fontSize: "3rem",
                  color: "#A076F9",
                  marginBottom: "1rem",
                }}
              />
              <h2>No courses found</h2>
              <p>Try adjusting your search criteria</p>
            </div>
          )}
        </MainContent>

        <SidebarWrapper>
          <StatCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3>
              <FaChartBar /> Grade Summary
            </h3>
            <GradePercentage>
              <div className="grade-stat">
                <div className="value neutral">{calculateGPA()}</div>
                <div className="label">GPA</div>
              </div>
              <div className="grade-stat">
                <div className="value neutral">
                  {calculateAveragePercentage()}%
                </div>
                <div className="label">Average</div>
              </div>
              <div className="grade-stat">
                <div className="value positive">
                  <FaChartLine /> +0.2
                </div>
                <div className="label">From Last Term</div>
              </div>
              <div className="grade-stat">
                <div className="value neutral">{grades.length}</div>
                <div className="label">Courses</div>
              </div>
            </GradePercentage>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3>
              <FaChartBar /> Grade Distribution
            </h3>
            <GradeDistribution>
              {Object.entries(gradeDistribution).map(([grade, count]) => (
                <div className="grade-bar" key={grade}>
                  <div className="label">{grade}</div>
                  <div className="bar-wrapper">
                    <div
                      className="bar"
                      style={{ width: `${Math.min(100, count * 10)}%` }}
                    ></div>
                  </div>
                  <div className="count">{count}</div>
                </div>
              ))}
            </GradeDistribution>
          </StatCard>

          <GradeProgressCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h3>
              <FaChartLine /> Progress Tracker
            </h3>
            <div className="progress-section">
              <div className="header">
                <div className="title">Semester Completion</div>
                <div className="value">75%</div>
              </div>
              <div className="progress-bar">
                <div className="bar" style={{ width: "75%" }}></div>
              </div>
            </div>

            <div className="progress-section">
              <div className="header">
                <div className="title">Assignments Completed</div>
                <div className="value">85%</div>
              </div>
              <div className="progress-bar">
                <div className="bar" style={{ width: "85%" }}></div>
              </div>
            </div>

            <div className="progress-section">
              <div className="header">
                <div className="title">Overall Performance</div>
                <div className="value">92%</div>
              </div>
              <div className="progress-bar">
                <div className="bar" style={{ width: "92%" }}></div>
              </div>
            </div>
          </GradeProgressCard>

          <StatCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h3>
              <FaChartBar /> Weekly Activity
            </h3>
            <ActivityChart>
              {activitiesData.map((value, index) => (
                <div
                  key={index}
                  className={`bar ${value === 0 ? "inactive" : ""}`}
                  style={{ height: `${value}%` }}
                ></div>
              ))}
            </ActivityChart>
            <ActivityLabels>
              {activityLabels.map((label, index) => (
                <div key={index} className="label">
                  {label}
                </div>
              ))}
            </ActivityLabels>
          </StatCard>
        </SidebarWrapper>
      </ContentWrapper>
    </GradesContainer>
  );
};

export default Grades;
