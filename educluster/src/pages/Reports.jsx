import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";
import {
  FaChartBar,
  FaFilter,
  FaFileExport,
  FaSearch,
  FaBook,
  FaClipboardList,
  FaUserGraduate,
  FaCalendarAlt,
  FaDownload,
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
  
  .app-container {
    padding-top: 70px;  /* Add space for the navbar */
  }
`;

const ReportsContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #121214;
  color: #e0e0e0;
  padding: 1.5rem;
  padding-top: 2rem;

  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  margin-top: 1rem;
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
      color: #A076F9;
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
  gap: 1.2rem;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 0.8rem;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    gap: 0.8rem;
    margin-top: 1rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.8rem;
  align-items: center;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
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
  justify-content: center;
  gap: 0.6rem;
  box-shadow: ${props => props.primary ? '0 4px 15px rgba(126, 87, 194, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.15)'};
  transition: all 0.3s ease;
  min-width: ${props => props.icon ? '42px' : '120px'};
  height: 38px;
  flex-shrink: 0;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: ${props => props.disabled ? '0.6' : '1'};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};

  &:hover {
    box-shadow: ${props => props.primary ? '0 6px 20px rgba(126, 87, 194, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.2)'};
    background: ${props => props.primary ? 'linear-gradient(135deg, #b18aff, #9065db)' : 'rgba(40, 40, 45, 0.6)'};
  }
  
  @media (max-width: 768px) {
    min-width: ${props => props.icon ? '38px' : '90px'};
    padding: 0.6rem ${props => props.icon ? '0.8rem' : '1rem'};
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    min-width: ${props => props.icon ? '36px' : '80px'};
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  max-width: 300px;
  width: 100%;
  flex-shrink: 1;
  margin-right: 0.5rem;
  
  input {
    width: 100%;
    padding: 0.6rem 1rem 0.6rem 2.5rem;
    border-radius: 50px;
    background: rgba(30, 30, 35, 0.6);
    border: 1px solid rgba(160, 118, 249, 0.2);
    color: #e0e0e0;
    font-size: 0.9rem;
    height: 38px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    
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
  
  @media (max-width: 768px) {
    flex-basis: 100%;
    max-width: 100%;
    margin-right: 0;
    margin-bottom: 0.8rem;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.8rem;
  margin-top: 0.5rem;
  border-bottom: 1px solid rgba(50, 50, 60, 0.4);
  padding-bottom: 0.8rem;
  overflow-x: auto;
  flex-wrap: nowrap;
  flex: 1;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(160, 118, 249, 0.3);
    border-radius: 10px;
  }
  
  @media (max-width: 768px) {
    gap: 0.5rem;
    padding-bottom: 0.8rem;
    margin-bottom: 1rem;
  }
`;

const Tab = styled(motion.button)`
  padding: 0.7rem 1.5rem;
  background: ${props => props.active ? 'rgba(160, 118, 249, 0.15)' : 'rgba(30, 30, 35, 0.6)'};
  color: ${props => props.active ? '#A076F9' : '#a0a0a0'};
  border: ${props => props.active ? '1px solid rgba(160, 118, 249, 0.3)' : '1px solid rgba(50, 50, 60, 0.4)'};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: ${props => props.active ? '600' : '400'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: fit-content;
  margin: 0 0.1rem;
  box-shadow: ${props => props.active ? '0 4px 12px rgba(126, 87, 194, 0.15)' : 'none'};
  
  &:hover {
    background: ${props => props.active ? 'rgba(160, 118, 249, 0.2)' : 'rgba(40, 40, 45, 0.6)'};
    color: ${props => props.active ? '#A076F9' : '#d0d0d0'};
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.8rem;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 2rem;
  padding: 1rem 0;
  margin-top: 0.5rem;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const ReportList = styled.div`
  flex: 1;
  min-width: 0;
`;

const ReportCard = styled(motion.div)`
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

      .category {
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

    .date {
      font-size: 0.85rem;
      color: #a0a0a0;
    }
  }

  .card-content {
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
    }
  }
`;

const ReportDetailSection = styled.div`
  width: 350px;
  flex-shrink: 0;
  
  @media (max-width: 1200px) {
    width: 320px;
  }

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const ReportDetail = styled(motion.div)`
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
      }
    }
  }

  .chart-container {
    margin: 1rem 0;
    height: 200px;
    position: relative;
  }

  .button-container {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
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

    select {
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
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }
`;

// Sample report data
const reportsData = [
  {
    id: 1,
    title: "Course Performance Report - CS101",
    category: "Course Analysis",
    date: "2025-07-20",
    generatedBy: "Dr. Sarah Johnson",
    description: "Analysis of student performance in Introduction to Computer Science.",
    metrics: {
      avgGrade: 85,
      completionRate: 92,
      topStudents: 5,
    },
  },
  {
    id: 2,
    title: "Assignment Completion Report - CS210",
    category: "Assignment Analysis",
    date: "2025-07-22",
    generatedBy: "Prof. Michael Chen",
    description: "Overview of assignment submission rates and grades for Data Structures and Algorithms.",
    metrics: {
      submissionRate: 88,
      avgPoints: 45,
      lateSubmissions: 2,
    },
  },
  {
    id: 3,
    title: "Student Progress Report - IT205",
    category: "Student Progress",
    date: "2025-07-21",
    generatedBy: "Emma Rodriguez",
    description: "Detailed progress tracking for students in Web Development Fundamentals.",
    metrics: {
      avgAttendance: 95,
      gradeTrend: "Upward",
      alerts: 1,
    },
  },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf");

  const filteredReports = reportsData.filter(report => {
    if (searchTerm && !report.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !report.category.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (activeTab === "course" && report.category !== "Course Analysis") return false;
    if (activeTab === "assignment" && report.category !== "Assignment Analysis") return false;
    if (activeTab === "student" && report.category !== "Student Progress") return false;
    return true;
  });

  const handleExport = () => {
    // Simulate export (in a real app, this would trigger a file download)
    console.log(`Exporting ${selectedReport.title} as ${exportFormat}`);
    setShowExportModal(false);
  };

  const drawChart = (canvas, metrics) => {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const data = Object.values(metrics).map(val => val);
    const maxValue = Math.max(...data);
    const barWidth = (width / data.length) * 0.6;

    ctx.fillStyle = "#A076F9";
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * (height - 40);
      ctx.fillRect(index * (width / data.length) + 10, height - barHeight - 10, barWidth, barHeight);
    });

    ctx.fillStyle = "#e0e0e0";
    ctx.font = "12px Arial";
    data.forEach((value, index) => {
      ctx.fillText(value, index * (width / data.length) + 15, height - 20);
    });
  };

  return (
    <ReportsContainer className="app-container">
      <GlobalStyles />

      <Header>
        <h1><FaChartBar /> Reports</h1>
        <ToolBar>
          <SearchInputWrapper>
            <FaSearch />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInputWrapper>
          <ButtonGroup>
            <Button
              primary
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowExportModal(true)}
              disabled={!selectedReport}
              aria-label="Export report"
            >
              <FaFileExport /> Export
            </Button>
            <Button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={!selectedReport}
              aria-label="Filter report"
            >
              <FaFilter /> Filter
            </Button>
          </ButtonGroup>
        </ToolBar>
      </Header>

      <TabsContainer>
        <Tab active={activeTab === "all"} onClick={() => setActiveTab("all")}>
          <FaChartBar /> All Reports
        </Tab>
        <Tab active={activeTab === "course"} onClick={() => setActiveTab("course")}>
          <FaBook /> Course Analysis
        </Tab>
        <Tab active={activeTab === "assignment"} onClick={() => setActiveTab("assignment")}>
          <FaClipboardList /> Assignment Analysis
        </Tab>
        <Tab active={activeTab === "student"} onClick={() => setActiveTab("student")}>
          <FaUserGraduate /> Student Progress
        </Tab>
      </TabsContainer>

      <div style={{ height: "10px" }}></div>

      <ContentWrapper>
        <ReportList>
          {filteredReports.map(report => (
            <ReportCard
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedReport(report)}
              style={{
                borderLeft: selectedReport && selectedReport.id === report.id ? '4px solid #A076F9' : '1px solid rgba(50, 50, 60, 0.4)',
              }}
            >
              <div className="card-header">
                <div className="title-section">
                  <h3>
                    <FaChartBar /> {report.title}
                  </h3>
                  <div className="category">
                    <FaBook /> {report.category}
                  </div>
                </div>
                <div className="date">
                  {new Date(report.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
              <div className="card-content">
                <div className="info-item">
                  <FaUserGraduate /> Generated by: {report.generatedBy}
                </div>
                <div className="info-item">
                  <FaCalendarAlt /> Last Updated: {new Date(report.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </ReportCard>
          ))}

          {filteredReports.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#a0a0a0',
              background: 'rgba(25, 25, 30, 0.8)',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(50, 50, 60, 0.4)',
            }}>
              <FaChartBar style={{ fontSize: '3rem', color: '#A076F9', marginBottom: '1rem' }} />
              <h2>No reports found</h2>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </ReportList>

        <ReportDetailSection>
          {selectedReport ? (
            <ReportDetail
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3><FaChartBar /> Report Details</h3>

              <div className="detail-section">
                <h4>{selectedReport.title}</h4>
                <div className="detail-list">
                  <div classKey={selectedReport.id} className="detail-item">
                    <FaBook /> Category: {selectedReport.category}
                  </div>
                  <div className="detail-item">
                    <FaUserGraduate /> Generated by: {selectedReport.generatedBy}
                  </div>
                  <div className="detail-item">
                    <FaCalendarAlt /> Date: {new Date(selectedReport.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Description</h4>
                <p>{selectedReport.description}</p>
              </div>

              <div className="chart-container">
                <canvas ref={canvas => canvas && drawChart(canvas, selectedReport.metrics)} />
              </div>

              <div className="detail-section">
                <h4>Key Metrics</h4>
                <div className="detail-list">
                  {Object.entries(selectedReport.metrics).map(([key, value]) => (
                    <div key={key} className="detail-item">
                      <FaChartBar /> {key.replace(/([A-Z])/g, ' $1').trim()}: {value}
                    </div>
                  ))}
                </div>
              </div>

              <div className="button-container">
                <ButtonGroup>
                  <Button
                    primary
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowExportModal(true)}
                    aria-label="Export report"
                  >
                    <FaFileExport /> Export
                  </Button>
                  <Button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    aria-label="Download data"
                  >
                    <FaDownload /> Download
                  </Button>
                </ButtonGroup>
              </div>
            </ReportDetail>
          ) : (
            <ReportDetail
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3><FaChartBar /> Report Details</h3>
              <p style={{ color: '#a0a0a0', textAlign: 'center', margin: '2rem 0' }}>
                Select a report to view details
              </p>
            </ReportDetail>
          )}
        </ReportDetailSection>
      </ContentWrapper>

      {showExportModal && selectedReport && (
        <ModalBackdrop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowExportModal(false)}
        >
          <ModalContent
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2><FaFileExport /> Export Report</h2>

            <div className="form-group">
              <label>Export Format</label>
              <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
              </select>
            </div>

            <div className="modal-actions">
              <ButtonGroup>
                <Button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowExportModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  primary
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleExport}
                >
                  <FaDownload /> Export
                </Button>
              </ButtonGroup>
            </div>
          </ModalContent>
        </ModalBackdrop>
      )}
    </ReportsContainer>
  );
};

export default Reports;