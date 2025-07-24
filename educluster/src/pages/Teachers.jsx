import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";
import {
    FaClipboardList,
    FaSearch,
    FaFilter,
    FaUserTie,
    FaCalendarAlt,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaChartBar,
    FaPlus,
    FaSortAmountDown,
    FaSortAmountUp,
    FaEye,
    FaEdit,
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

const TeachersContainer = styled.div`
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
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const TeacherList = styled.div`
  flex: 1;
  min-width: 0;
`;

const TeacherCard = styled(motion.div)`
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
      
      .specialization {
        font-size: 0.9rem;
        color: #a0a0a0;
        display: flex;
        align-items: center;
        gap: 0.4rem;
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
      
      &.available {
        background: rgba(76, 175, 80, 0.15);
        color: #4CAF50;
      }
      
      &.busy {
        background: rgba(244, 67, 54, 0.15);
        color: #F44336;
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
`;

const TeacherDetailSection = styled.div`
  width: 350px;
  flex-shrink: 0;
  
  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const TeacherDetail = styled(motion.div)`
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
    
    .appointment-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      
      .appointment-item {
        padding: 0.6rem 0.8rem;
        border-radius: 8px;
        background: rgba(35, 35, 40, 0.5);
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .appointment-info {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          
          .appointment-title {
            font-size: 0.9rem;
            color: #e0e0e0;
          }
          
          .appointment-time {
            font-size: 0.8rem;
            color: #a0a0a0;
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
    grid-template-columns: repeat(3, 1fr);
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
        
        &.appointments {
          background: rgba(33, 150, 243, 0.15);
          color: #2196F3;
        }
        
        &.available {
          background: rgba(76, 175, 80, 0.15);
          color: #4CAF50;
        }
        
        &.clients {
          background: rgba(160, 118, 249, 0.15);
          color: #A076F9;
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

// Sample teacher data
const teachersData = [
    {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialization: "Mathematics",
        email: "sarah.johnson@example.com",
        phone: "+1-555-123-4567",
        status: "available",
        branch: "Main Branch",
        appointments: [
            { id: 1, client: "John Doe", service: "Math Consultation", date: "2025-07-25", time: "10:00 AM" },
            { id: 2, client: "Jane Smith", service: "Algebra Workshop", date: "2025-07-26", time: "2:00 PM" }
        ],
        availability: [
            { day: "Monday", time: "9:00 AM - 12:00 PM" },
            { day: "Wednesday", time: "1:00 PM - 4:00 PM" }
        ],
        totalClients: 15
    },
    {
        id: 2,
        name: "Prof. Michael Chen",
        specialization: "Physics",
        email: "michael.chen@example.com",
        phone: "+1-555-987-6543",
        status: "busy",
        branch: "North Branch",
        appointments: [
            { id: 3, client: "Alice Brown", service: "Physics Tutoring", date: "2025-07-24", time: "11:00 AM" }
        ],
        availability: [
            { day: "Tuesday", time: "10:00 AM - 1:00 PM" },
            { day: "Friday", time: "2:00 PM - 5:00 PM" }
        ],
        totalClients: 8
    },
    {
        id: 3,
        name: "Emma Rodriguez",
        specialization: "Language Arts",
        email: "emma.rodriguez@example.com",
        phone: "+1-555-456-7890",
        status: "available",
        branch: "Main Branch",
        appointments: [],
        availability: [
            { day: "Monday", time: "1:00 PM - 3:00 PM" },
            { day: "Thursday", time: "9:00 AM - 11:00 AM" }
        ],
        totalClients: 12
    }
];

const Teachers = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [showFilter, setShowFilter] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [newAvailability, setNewAvailability] = useState({ day: "", time: "" });
    const [showStatistics, setShowStatistics] = useState(false);

    // Calculate statistics
    const stats = {
        available: teachersData.filter(t => t.status === "available").length,
        busy: teachersData.filter(t => t.status === "busy").length,
        totalAppointments: teachersData.reduce((sum, t) => sum + t.appointments.length, 0),
        totalClients: teachersData.reduce((sum, t) => sum + t.totalClients, 0)
    };

    // Filter and sort teachers
    const filteredTeachers = teachersData.filter(teacher => {
        if (searchTerm && !teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }

        if (activeTab === "available" && teacher.status !== "available") return false;
        if (activeTab === "busy" && teacher.status !== "busy") return false;

        if (activeFilter === "mainBranch" && teacher.branch !== "Main Branch") return false;
        if (activeFilter === "northBranch" && teacher.branch !== "North Branch") return false;

        return true;
    }).sort((a, b) => {
        if (sortOrder === "name") {
            return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else if (sortOrder === "specialization") {
            return sortDirection === "asc" ? a.specialization.localeCompare(b.specialization) : b.specialization.localeCompare(a.specialization);
        } else if (sortOrder === "appointments") {
            return sortDirection === "asc" ? a.appointments.length - b.appointments.length : b.appointments.length - a.appointments.length;
        }
        return 0;
    });

    // Handle teacher selection
    const handleTeacherSelect = (teacher) => {
        setSelectedTeacher(teacher);
    };

    // Handle new availability submission
    const handleAddAvailability = () => {
        if (newAvailability.day && newAvailability.time) {
            const updatedTeachers = teachersData.map(teacher => {
                if (teacher.id === selectedTeacher.id) {
                    return {
                        ...teacher,
                        availability: [...teacher.availability, newAvailability]
                    };
                }
                return teacher;
            });
            setSelectedTeacher({
                ...selectedTeacher,
                availability: [...selectedTeacher.availability, newAvailability]
            });
            setNewAvailability({ day: "", time: "" });
            setShowScheduleModal(false);
        }
    };

    // Toggle sort direction
    const toggleSortDirection = () => {
        setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    };

    return (
        <TeachersContainer>
            <GlobalStyles />

            <Header>
                <h1><FaUserTie /> Teachers</h1>
                <ToolBar>
                    <SearchInputWrapper>
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search teachers..."
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
                            <FaFilter /> Filter: {activeFilter === 'all' ? 'All' : activeFilter === 'mainBranch' ? 'Main Branch' : 'North Branch'}
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
                                {['all', 'mainBranch', 'northBranch'].map((filter) => (
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
                                        {filter === 'all' ? 'All Teachers' :
                                            filter === 'mainBranch' ? 'Main Branch' :
                                                'North Branch'}
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
                        <FaClipboardList /> All Teachers
                    </Tab>
                    <Tab active={activeTab === "available"} onClick={() => setActiveTab("available")}>
                        <FaCheckCircle /> Available ({stats.available})
                    </Tab>
                    <Tab active={activeTab === "busy"} onClick={() => setActiveTab("busy")}>
                        <FaTimesCircle /> Busy ({stats.busy})
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
                    <h3><FaChartBar /> Teacher Statistics</h3>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-icon appointments">
                                <FaCalendarAlt />
                            </div>
                            <div className="stat-value">{stats.totalAppointments}</div>
                            <div className="stat-label">Total Appointments</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-icon available">
                                <FaCheckCircle />
                            </div>
                            <div className="stat-value">{stats.available}</div>
                            <div className="stat-label">Available Teachers</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-icon clients">
                                <FaUserTie />
                            </div>
                            <div className="stat-value">{stats.totalClients}</div>
                            <div className="stat-label">Total Clients</div>
                        </div>
                    </div>
                </StatsCard>
            )}

            <ContentWrapper>
                <TeacherList>
                    {filteredTeachers.map(teacher => (
                        <TeacherCard
                            key={teacher.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => handleTeacherSelect(teacher)}
                            style={{
                                borderLeft: selectedTeacher && selectedTeacher.id === teacher.id ?
                                    '4px solid #A076F9' : '1px solid rgba(50, 50, 60, 0.4)'
                            }}
                        >
                            <div className="card-header">
                                <div className="title-section">
                                    <h3>
                                        <FaUserTie /> {teacher.name}
                                    </h3>
                                    <div className="specialization">
                                        {teacher.specialization}
                                    </div>
                                </div>

                                <div className={`status-badge ${teacher.status}`}>
                                    {teacher.status === "available" && <FaCheckCircle />}
                                    {teacher.status === "busy" && <FaTimesCircle />}
                                    {teacher.status.charAt(0).toUpperCase() + teacher.status.slice(1)}
                                </div>
                            </div>

                            <div className="card-content">
                                <div className="info-section">
                                    <div className="info-item">
                                        <FaCalendarAlt /> Branch: {teacher.branch}
                                    </div>
                                    <div className="info-item">
                                        <FaClock /> Appointments: {teacher.appointments.length}
                                    </div>
                                    <div className="info-item">
                                        <FaUserTie /> Clients: {teacher.totalClients}
                                    </div>
                                </div>

                                <div className="action-buttons">
                                    <button onClick={(e) => { e.stopPropagation(); }}>
                                        <FaEye />
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); setShowScheduleModal(true); setSelectedTeacher(teacher); }}>
                                        <FaEdit />
                                    </button>
                                </div>
                            </div>
                        </TeacherCard>
                    ))}

                    {filteredTeachers.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem',
                            color: '#a0a0a0',
                            background: 'rgba(25, 25, 30, 0.8)',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(50, 50, 60, 0.4)',
                        }}>
                            <FaUserTie style={{ fontSize: '3rem', color: '#A076F9', marginBottom: '1rem' }} />
                            <h2>No teachers found</h2>
                            <p>Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </TeacherList>

                <TeacherDetailSection>
                    {selectedTeacher ? (
                        <TeacherDetail
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h3><FaUserTie /> Teacher Details</h3>

                            <div className="detail-section">
                                <h4>{selectedTeacher.name}</h4>
                                <div className="detail-list">
                                    <div className="detail-item">
                                        <FaUserTie /> Specialization: {selectedTeacher.specialization}
                                    </div>
                                    <div className="detail-item">
                                        <FaCalendarAlt /> Branch: {selectedTeacher.branch}
                                    </div>
                                    <div className="detail-item">
                                        <FaUserTie /> Email: {selectedTeacher.email}
                                    </div>
                                    <div className="detail-item">
                                        <FaUserTie /> Phone: {selectedTeacher.phone}
                                    </div>
                                    <div className="detail-item highlight">
                                        <FaClock /> Status: {selectedTeacher.status.charAt(0).toUpperCase() + selectedTeacher.status.slice(1)}
                                    </div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Upcoming Appointments</h4>
                                <div className="appointment-list">
                                    {selectedTeacher.appointments.length > 0 ? selectedTeacher.appointments.map(appointment => (
                                        <div className="appointment-item" key={appointment.id}>
                                            <div className="appointment-info">
                                                <div className="appointment-title">{appointment.service} with {appointment.client}</div>
                                                <div className="appointment-time">
                                                    {new Date(appointment.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })} at {appointment.time}
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <p>No upcoming appointments</p>
                                    )}
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>Availability</h4>
                                <div className="appointment-list">
                                    {selectedTeacher.availability.length > 0 ? selectedTeacher.availability.map((slot, index) => (
                                        <div className="appointment-item" key={index}>
                                            <div className="appointment-info">
                                                <div className="appointment-title">{slot.day}</div>
                                                <div className="appointment-time">{slot.time}</div>
                                            </div>
                                        </div>
                                    )) : (
                                        <p>No availability set</p>
                                    )}
                                </div>
                            </div>

                            <div className="button-container">
                                <Button
                                    primary
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setShowScheduleModal(true)}
                                >
                                    <FaPlus /> Add Availability
                                </Button>
                            </div>
                        </TeacherDetail>
                    ) : (
                        <TeacherDetail
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h3><FaUserTie /> Teacher Details</h3>
                            <p style={{ color: '#a0a0a0', textAlign: 'center', margin: '2rem 0' }}>
                                Select a teacher to view details
                            </p>
                        </TeacherDetail>
                    )}
                </TeacherDetailSection>
            </ContentWrapper>

            {/* Schedule Modal */}
            {showScheduleModal && selectedTeacher && (
                <ModalBackdrop
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowScheduleModal(false)}
                >
                    <ModalContent
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2><FaCalendarAlt /> Add Availability</h2>

                        <div className="form-group">
                            <label>Teacher</label>
                            <input
                                type="text"
                                value={selectedTeacher.name}
                                disabled
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Day</label>
                                <select
                                    value={newAvailability.day}
                                    onChange={(e) => setNewAvailability({ ...newAvailability, day: e.target.value })}
                                >
                                    <option value="">Select Day</option>
                                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Time Slot</label>
                                <input
                                    type="text"
                                    value={newAvailability.time}
                                    onChange={(e) => setNewAvailability({ ...newAvailability, time: e.target.value })}
                                    placeholder="e.g., 9:00 AM - 12:00 PM"
                                />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <Button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setShowScheduleModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                primary
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleAddAvailability}
                                disabled={!newAvailability.day || !newAvailability.time}
                                style={{ opacity: (!newAvailability.day || !newAvailability.time) ? 0.7 : 1 }}
                            >
                                <FaPaperPlane /> Add
                            </Button>
                        </div>
                    </ModalContent>
                </ModalBackdrop>
            )}
        </TeachersContainer>
    );
};

export default Teachers;