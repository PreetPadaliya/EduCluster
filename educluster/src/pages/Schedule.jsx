import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";
import {
    FaCalendarAlt,
    FaCalendarPlus,
    FaCalendarCheck,
    FaListAlt,
    FaFilter,
    FaSearch,
    FaChevronLeft,
    FaChevronRight,
    FaClock,
    FaMapMarkerAlt,
    FaUserFriends,
    FaBook,
    FaChalkboardTeacher,
    FaPlus,
    FaEdit,
    FaTrash,
    FaInfoCircle,
    FaDownload,
    FaShareAlt
} from "react-icons/fa";

const GlobalStyles = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background-color: #121214;
  }
`;

const ScheduleContainer = styled.div`
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

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  
  h2 {
    font-size: 1.4rem;
    font-weight: 600;
    margin: 0;
  }
  
  .controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    .date-display {
      min-width: 150px;
      text-align: center;
      font-weight: 500;
    }
    
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background: rgba(30, 30, 35, 0.6);
      color: #e0e0e0;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background: rgba(160, 118, 249, 0.2);
        color: #A076F9;
      }
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    
    .controls {
      width: 100%;
      justify-content: space-between;
    }
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 2rem;
  
  .day-name {
    text-align: center;
    font-weight: 600;
    color: #A076F9;
    padding: 0.5rem 0;
    font-size: 0.9rem;
  }
  
  @media (max-width: 768px) {
    gap: 4px;
    
    .day-name {
      font-size: 0.8rem;
    }
  }
`;

const CalendarDay = styled.div`
  background: ${props => props.isToday ? 'rgba(160, 118, 249, 0.15)' : 'rgba(25, 25, 30, 0.8)'};
  border: 1px solid ${props => props.isToday ? 'rgba(160, 118, 249, 0.4)' : 'rgba(50, 50, 60, 0.4)'};
  border-radius: 8px;
  padding: 0.5rem;
  min-height: 100px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: rgba(160, 118, 249, 0.3);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .day-number {
    text-align: center;
    font-weight: ${props => props.isToday ? '600' : '400'};
    color: ${props => props.isToday ? '#A076F9' : '#a0a0a0'};
    margin-bottom: 0.5rem;
  }
  
  .events {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  &.other-month {
    opacity: 0.5;
  }
  
  @media (max-width: 768px) {
    min-height: 60px;
    
    .day-number {
      font-size: 0.8rem;
    }
  }
`;

const EventIndicator = styled.div`
  background: ${props => props.color || '#A076F9'};
  border-radius: 4px;
  padding: 3px 6px;
  font-size: 0.7rem;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UpcomingEvents = styled.div`
  background: rgba(25, 25, 30, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(50, 50, 60, 0.4);
  
  h3 {
    margin-top: 0;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      color: #A076F9;
    }
  }
`;

const EventCard = styled(motion.div)`
  background: rgba(35, 35, 40, 0.5);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 4px solid ${props => props.color || '#A076F9'};
  
  .event-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.8rem;
    
    h4 {
      margin: 0;
      font-size: 1.1rem;
      color: #e0e0e0;
    }
    
    .event-type {
      font-size: 0.75rem;
      padding: 3px 8px;
      background: rgba(160, 118, 249, 0.2);
      border-radius: 12px;
      color: #A076F9;
    }
  }
  
  .event-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    
    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #a0a0a0;
      font-size: 0.9rem;
      
      svg {
        color: #A076F9;
        font-size: 0.9rem;
      }
    }
  }
  
  .event-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
    
    button {
      background: transparent;
      border: none;
      color: #a0a0a0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      transition: all 0.2s ease;
      
      &:hover {
        background: rgba(160, 118, 249, 0.1);
        color: #A076F9;
      }
    }
  }
`;

const ResourcesSection = styled.div`
  background: rgba(25, 25, 30, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(50, 50, 60, 0.4);
  margin-top: 2rem;
  
  h3 {
    margin-top: 0;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      color: #A076F9;
    }
  }
`;

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const ResourceCard = styled(motion.div)`
  background: rgba(35, 35, 40, 0.5);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid rgba(50, 50, 60, 0.4);
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    border-color: rgba(160, 118, 249, 0.3);
  }
  
  h4 {
    margin: 0 0 0.8rem 0;
    font-size: 1rem;
    color: #e0e0e0;
  }
  
  p {
    color: #a0a0a0;
    font-size: 0.9rem;
    margin: 0 0 1rem 0;
  }
  
  .resource-actions {
    display: flex;
    justify-content: space-between;
    
    .type {
      font-size: 0.75rem;
      padding: 3px 8px;
      background: rgba(160, 118, 249, 0.15);
      border-radius: 12px;
      color: #A076F9;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
    
    .actions {
      display: flex;
      gap: 0.5rem;
      
      button {
        background: transparent;
        border: none;
        color: #a0a0a0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        transition: all 0.2s ease;
        
        &:hover {
          background: rgba(160, 118, 249, 0.1);
          color: #A076F9;
        }
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

const Schedule = () => {
    const [activeTab, setActiveTab] = useState("calendar");
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 6, 23));

    const [showFilter, setShowFilter] = useState(false);
    const [activeFilter, setActiveFilter] = useState("all");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: "",
        type: "Class",
        date: "2025-07-23",
        time: "",
        location: "",
        participants: "",
        subject: ""
    });

    const events = [
        { id: 1, title: "Introduction to AI", type: "Class", date: "2025-07-23", time: "10:00 AM - 12:00 PM", location: "Room 101", participants: "30 students", subject: "Computer Science" },
        { id: 2, title: "Data Structures Study Group", type: "Meeting", date: "2025-07-23", time: "2:00 PM - 4:00 PM", location: "Library", participants: "8 students", subject: "Computer Science" },
        { id: 3, title: "Mathematics Lecture", type: "Class", date: "2025-07-24", time: "10:00 AM - 12:00 PM", location: "Room 101", participants: "30 students", subject: "Mathematics" },
        { id: 4, title: "Physics Lab", type: "Lab", date: "2025-07-24", time: "2:00 PM - 4:00 PM", location: "Science Building", participants: "20 students", subject: "Physics" },
        { id: 5, title: "Faculty Meeting", type: "Meeting", date: "2025-07-25", time: "9:00 AM - 10:30 AM", location: "Conference Room", participants: "All faculty", subject: "Academic Planning" },
        { id: 6, title: "Computer Science Lecture", type: "Class", date: "2025-07-26", time: "11:00 AM - 1:00 PM", location: "Room 203", participants: "35 students", subject: "Computer Science" }
    ];

    const resources = [
        { id: 1, title: "Academic Calendar 2025", type: "PDF", description: "Complete academic year schedule with all important dates and events." },
        { id: 2, title: "Room Allocation Guide", type: "DOC", description: "Guidelines for classroom and meeting room reservations." },
        { id: 3, title: "How to Schedule Classes", type: "Video", description: "Tutorial on using the scheduling system for faculty members." },
        { id: 4, title: "Exam Schedule Template", type: "XLS", description: "Template for creating and planning examination schedules." },
        { id: 5, title: "Event Request Form", type: "PDF", description: "Form to request special events and book venues." },
        { id: 6, title: "Scheduling Policies", type: "PDF", description: "Official policies regarding class scheduling and room usage." }
    ];


    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDay = new Date(year, month, 1);

        const lastDay = new Date(year, month + 1, 0);


        const daysFromPrevMonth = firstDay.getDay();

        const daysInMonth = lastDay.getDate();

        const days = [];

        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
            days.push({
                day: prevMonthLastDay - i,
                currentMonth: false,
                date: new Date(year, month - 1, prevMonthLastDay - i)
            });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                currentMonth: true,
                date: new Date(year, month, i),
                isToday: new Date(year, month, i).toDateString() === new Date(2025, 6, 23).toDateString()
            });
        }

        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                day: i,
                currentMonth: false,
                date: new Date(year, month + 1, i)
            });
        }

        return days;
    };

    const getEventsForDay = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        let filteredEvents = events.filter(event => event.date === dateStr);


        if (activeFilter !== "all") {
            filteredEvents = filteredEvents.filter(event =>
                event.type.toLowerCase() === activeFilter.toLowerCase()
            );
        }

        return filteredEvents;
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const goToToday = () => {

        setCurrentMonth(new Date(2025, 6, 23));
    };

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent({
            ...newEvent,
            [name]: value
        });
    };

    const handleCreateEvent = () => {

        const newId = events.length + 1;
        const createdEvent = {
            id: newId,
            ...newEvent
        };
        events.unshift(createdEvent);
        setShowCreateModal(false);
        setNewEvent({
            title: "",
            type: "Class",
            date: "2025-07-23",
            time: "",
            location: "",
            participants: "",
            subject: ""
        });
    };

    return (
        <ScheduleContainer>
            <GlobalStyles />

            <Header>
                <h1><FaCalendarAlt /> Schedule</h1>
                <ToolBar>
                    <Button
                        primary
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowCreateModal(true)}
                    >
                        <FaCalendarPlus /> Create Event
                    </Button>
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
                                    width: '160px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                                    border: '1px solid rgba(50, 50, 60, 0.4)',
                                    zIndex: 100
                                }}
                            >
                                {['all', 'class', 'lab', 'meeting'].map((filter) => (
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
                                        {filter === 'all' ? 'All Events' : filter.charAt(0).toUpperCase() + filter.slice(1) + 's'}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </ToolBar>
            </Header>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
            }}>
                <TabsContainer style={{ marginBottom: '0' }}>
                    <Tab active={activeTab === "calendar"} onClick={() => setActiveTab("calendar")}>
                        <FaCalendarAlt /> Calendar View
                    </Tab>
                    <Tab active={activeTab === "list"} onClick={() => setActiveTab("list")}>
                        <FaListAlt /> List View
                    </Tab>
                    <Tab active={activeTab === "resources"} onClick={() => setActiveTab("resources")}>
                        <FaBook /> Resources
                    </Tab>
                </TabsContainer>
            </div>

            {activeTab === "calendar" && (
                <div style={{ marginTop: '1rem' }}>
                    <CalendarHeader>
                        <h2>Monthly Calendar</h2>
                        <div className="controls">
                            <button onClick={prevMonth}><FaChevronLeft /></button>
                            <button onClick={goToToday}>Today</button>
                            <div className="date-display">
                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </div>
                            <button onClick={nextMonth}><FaChevronRight /></button>
                        </div>
                    </CalendarHeader>

                    <CalendarGrid>
                        {dayNames.map(day => (
                            <div key={day} className="day-name">{day}</div>
                        ))}

                        {generateCalendarDays().map((day, index) => (
                            <CalendarDay
                                key={index}
                                isToday={day.isToday}
                                className={!day.currentMonth ? "other-month" : ""}
                                onClick={() => {
                                    // Only allow creating events in the current month
                                    if (day.currentMonth) {
                                        const dateStr = day.date.toISOString().split('T')[0];
                                        setNewEvent({ ...newEvent, date: dateStr });
                                        setShowCreateModal(true);
                                    }
                                }}
                            >
                                <div className="day-number">{day.day}</div>
                                <div className="events">
                                    {getEventsForDay(day.date).slice(0, 2).map(event => (
                                        <EventIndicator
                                            key={event.id}
                                            color={
                                                event.type === "Class" ? "#7E57C2" :
                                                    event.type === "Lab" ? "#2196F3" :
                                                        "#4CAF50"
                                            }
                                        >
                                            {event.title}
                                        </EventIndicator>
                                    ))}
                                    {getEventsForDay(day.date).length > 2 && (
                                        <EventIndicator color="#808080">
                                            +{getEventsForDay(day.date).length - 2} more
                                        </EventIndicator>
                                    )}
                                </div>
                            </CalendarDay>
                        ))}
                    </CalendarGrid>

                    <UpcomingEvents>
                        <h3><FaCalendarCheck /> Upcoming Events</h3>

                        {events
                            .filter(event => activeFilter === "all" || event.type.toLowerCase() === activeFilter.toLowerCase())
                            .map(event => (
                                <EventCard
                                    key={event.id}
                                    color={
                                        event.type === "Class" ? "#7E57C2" :
                                            event.type === "Lab" ? "#2196F3" :
                                                "#4CAF50"
                                    }
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="event-header">
                                        <h4>{event.title}</h4>
                                        <span className="event-type">{event.type}</span>
                                    </div>
                                    <div className="event-details">
                                        <div className="detail-item">
                                            <FaCalendarAlt /> {event.date}
                                        </div>
                                        <div className="detail-item">
                                            <FaClock /> {event.time}
                                        </div>
                                        <div className="detail-item">
                                            <FaMapMarkerAlt /> {event.location}
                                        </div>
                                        <div className="detail-item">
                                            <FaUserFriends /> {event.participants}
                                        </div>
                                        <div className="detail-item">
                                            <FaBook /> {event.subject}
                                        </div>
                                    </div>
                                    <div className="event-actions">
                                        <button><FaEdit /></button>
                                        <button><FaTrash /></button>
                                        <button><FaShareAlt /></button>
                                    </div>
                                </EventCard>
                            ))}
                    </UpcomingEvents>
                </div>
            )}

            {activeTab === "resources" && (
                <ResourcesSection>
                    <h3><FaBook /> Schedule Resources</h3>

                    <ResourceGrid>
                        {resources.map(resource => (
                            <ResourceCard
                                key={resource.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h4>{resource.title}</h4>
                                <p>{resource.description}</p>
                                <div className="resource-actions">
                                    <div className="type">
                                        {resource.type === "PDF" && "📄 PDF"}
                                        {resource.type === "DOC" && "📝 DOC"}
                                        {resource.type === "Video" && "🎬 Video"}
                                        {resource.type === "XLS" && "📊 Spreadsheet"}
                                    </div>
                                    <div className="actions">
                                        <button><FaInfoCircle /></button>
                                        <button><FaDownload /></button>
                                    </div>
                                </div>
                            </ResourceCard>
                        ))}
                    </ResourceGrid>
                </ResourcesSection>
            )}

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
                        <h2><FaCalendarPlus /> Create New Event</h2>

                        <div className="form-group">
                            <label htmlFor="event-title">Event Title</label>
                            <input
                                type="text"
                                id="event-title"
                                name="title"
                                value={newEvent.title}
                                onChange={handleInputChange}
                                placeholder="Enter event title"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="event-type">Event Type</label>
                                <select
                                    id="event-type"
                                    name="type"
                                    value={newEvent.type}
                                    onChange={handleInputChange}
                                >
                                    <option value="Class">Class</option>
                                    <option value="Lab">Lab</option>
                                    <option value="Meeting">Meeting</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="event-date">Date</label>
                                <input
                                    type="date"
                                    id="event-date"
                                    name="date"
                                    value={newEvent.date}
                                    onChange={handleInputChange}
                                    min="2025-07-23"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="event-time">Time</label>
                                <input
                                    type="text"
                                    id="event-time"
                                    name="time"
                                    value={newEvent.time}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 10:00 AM - 12:00 PM"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="event-location">Location</label>
                                <input
                                    type="text"
                                    id="event-location"
                                    name="location"
                                    value={newEvent.location}
                                    onChange={handleInputChange}
                                    placeholder="Enter location"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="event-participants">Participants</label>
                                <input
                                    type="text"
                                    id="event-participants"
                                    name="participants"
                                    value={newEvent.participants}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 30 students"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="event-subject">Subject</label>
                                <input
                                    type="text"
                                    id="event-subject"
                                    name="subject"
                                    value={newEvent.subject}
                                    onChange={handleInputChange}
                                    placeholder="Enter subject"
                                />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <Button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowCreateModal(false)}>
                                Cancel
                            </Button>
                            <Button primary whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleCreateEvent}>
                                Create Event
                            </Button>
                        </div>
                    </ModalContent>
                </ModalBackdrop>
            )}
        </ScheduleContainer>
    );
};

export default Schedule;
