import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";
import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
  FaBook,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaClipboardList,
  FaGraduationCap,
  FaUserFriends,
  FaBell,
  FaChartBar,
  FaSearch,
  FaUser,
  FaUserTag,
  FaSignOutAlt
} from "react-icons/fa";

// Import pages
import Schedule from "./Schedule";
import Course from "./Course";
import Assignment from "./Assignment";

// Global styles to ensure proper viewport fitting
const GlobalStyles = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background-color: #121214;
  }
  
  body {
    overflow: auto !important;
    position: relative;
    width: 100vw;
    height: 100vh;
  }
`;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: #121214;
  color: #e0e0e0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: rgba(20, 20, 25, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(50, 50, 60, 0.4);
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 64px;
  box-sizing: border-box;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const Logo = styled(motion.div)`
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #A076F9, #7E57C2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(motion.a)`
  color: #e0e0e0;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background: linear-gradient(135deg, #A076F9, #7E57C2);
    transition: width 0.3s ease;
  }
  
  &:hover:after {
    width: 100%;
  }

  &.active:after {
    width: 100%;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
`;

const Avatar = styled(motion.div)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #A076F9, #7E57C2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  cursor: pointer;
`;

const NotificationBell = styled(motion.div)`
  position: relative;
  color: #e0e0e0;
  font-size: 1.2rem;
  cursor: pointer;
  
  &:after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background: #ff5555;
    border-radius: 50%;
    top: 0;
    right: 0;
  }
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
  gap: 1.5rem;
  padding: 1.5rem;
  min-height: calc(100vh - 64px); /* Subtracting header height */
  width: 100%;
  box-sizing: border-box;
  max-width: 1920px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem 0.5rem;
  }
`;

const Sidebar = styled.aside`
  width: 250px;
  min-width: 250px;
  height: calc(100vh - 80px);
  max-height: calc(100vh - 80px);
  background: rgba(25, 25, 30, 0.8);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  position: sticky;
  top: 80px; /* Header height + some padding */
  
  /* Hide scrollbar but allow scrolling */
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(160, 118, 249, 0.3);
    border-radius: 10px;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
    height: auto;
    max-height: none;
    position: relative;
    top: 0;
  }
`;

const SidebarLink = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  color: #e0e0e0;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover, &.active {
    background: rgba(160, 118, 249, 0.15);
    color: #A076F9;
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0 0.5rem;
  width: 100%;
  overflow-y: auto;
`;

const WelcomeCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(126, 87, 194, 0.2), rgba(160, 118, 249, 0.1));
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(160, 118, 249, 0.2);
  position: relative;
  overflow: hidden;
  max-width: 1100px;
  margin: 0 auto;
  width: calc(100% - 2rem);
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(160, 118, 249, 0.1) 0%, rgba(126, 87, 194, 0) 70%);
    border-radius: 50%;
    transform: translate(25%, -40%);
    pointer-events: none;
    z-index: 0;
  }
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #e0e0e0, #ffffff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1.5rem;
    position: relative;
    z-index: 1;
    padding: 0;
  }
  
  p {
    color: #a0a0a0;
    max-width: 80%;
    line-height: 1.6;
    font-size: 1.05rem;
    position: relative;
    z-index: 1;
    padding: 0;
    margin-bottom: 0.5rem;
  }
`;

const QuickStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(25, 25, 30, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px solid rgba(50, 50, 60, 0.4);
  
  h3 {
    font-size: 1rem;
    color: #a0a0a0;
    margin: 0;
  }
  
  .value {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #A076F9, #7E57C2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .icon {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 1.5rem;
    color: rgba(160, 118, 249, 0.4);
  }
`;

const FeaturesSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(25, 25, 30, 0.8);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: 1px solid rgba(50, 50, 60, 0.4);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    border-color: rgba(160, 118, 249, 0.3);
  }
  
  .card-content {
    padding: 1.5rem;
  }
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: #e0e0e0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      color: #A076F9;
    }
  }
  
  p {
    color: #a0a0a0;
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, rgba(126, 87, 194, 0.2), rgba(160, 118, 249, 0.1));
  padding: 0.5rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(160, 118, 249, 0.15);
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin-top: 1.5rem;
  gap: 1rem;
  position: relative;
  z-index: 1;
`;

const Button = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  background: ${props => props.primary ? 'linear-gradient(135deg, #A076F9, #7E57C2)' : 'rgba(30, 30, 35, 0.5)'};
  color: ${props => props.primary ? 'white' : '#d0d0d0'};
  border: ${props => props.primary ? 'none' : '1px solid rgba(160, 118, 249, 0.3)'};
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
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

const SearchBar = styled.div`
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

const UserMenu = styled(motion.div)`
  position: absolute;
  top: 60px;
  right: 10px;
  background: rgba(25, 25, 30, 0.95);
  border-radius: 8px;
  overflow: hidden;
  width: 160px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(50, 50, 60, 0.4);
  z-index: 100;
`;

const MenuItem = styled(motion.div)`
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e0e0e0;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(160, 118, 249, 0.15);
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid rgba(50, 50, 60, 0.4);
  }
`;

const sidebarItems = [
  { icon: <FaBook />, label: "Courses", path: "/courses" },
  { icon: <FaCalendarAlt />, label: "Schedule", path: "/schedule" },
  { icon: <FaClipboardList />, label: "Assignments", path: "/assignments" },
  { icon: <FaChalkboardTeacher />, label: "Teachers", path: "/teachers" },
  { icon: <FaUserFriends />, label: "Classmates", path: "/classmates" },
  { icon: <FaGraduationCap />, label: "Grades", path: "/grades" },
  { icon: <FaChartBar />, label: "Reports", path: "/reports" }
];

// ScrollToTop component to ensure page is at the top when mounting
const ScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
};

const Home = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname === '/' ? '/courses' : location.pathname;
  const activeItem = sidebarItems.find(item => item.path === currentPath)?.label || "Courses";

  const [activeTab, setActiveTab] = useState(activeItem);
  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : "U";
  const role = user?.role || "Student";
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <HomeContainer>
      <GlobalStyles />
      <ScrollToTop />
      <Header>
        <Logo
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaGraduationCap /> EduCluster
        </Logo>

        <SearchBar>
          <FaSearch />
          <input type="text" placeholder="Search courses, assignments, etc." />
        </SearchBar>

        <UserSection>
          <NotificationBell
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaBell />
          </NotificationBell>

          <Avatar
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            {userInitial}
          </Avatar>

          {showUserMenu && (
            <UserMenu
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MenuItem
                whileHover={{ x: 5 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaUserFriends /> Profile
              </MenuItem>

              <MenuItem
                whileHover={{ x: 5 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaGraduationCap /> My Courses
              </MenuItem>

              <MenuItem
                whileHover={{ x: 5 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                onClick={onLogout}
              >
                <FaSignOutAlt /> Logout
              </MenuItem>
            </UserMenu>
          )}
        </UserSection>
      </Header>

      <MainContent>
        <Sidebar>
          {sidebarItems.map((item, index) => (
            <SidebarLink
              key={index}
              className={activeTab === item.label ? "active" : ""}
              onClick={() => {
                setActiveTab(item.label);
                navigate(item.path);
              }}
              whileHover={{ x: 5 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {item.icon}
              {item.label}
            </SidebarLink>
          ))}
        </Sidebar>

        <ContentArea>
          <Routes>
            <Route path="/courses" element={<Course />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/assignments" element={<Assignment />} />
            <Route path="*" element={
              <>
                <WelcomeCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1>Welcome back, {user?.username || "User"}!</h1>
                  <p>
                    You're logged in as <span style={{
                      color: '#A076F9',
                      fontWeight: 'bold',
                      textTransform: 'capitalize',
                      background: 'rgba(160, 118, 249, 0.1)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                    }}>{role}</span>.
                    Access all your educational resources, track assignments, communicate with teachers
                    and classmates, and manage your academic journey from this dashboard.
                  </p>
                  <ButtonWrapper>
                    <Button
                      primary
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <FaChartBar style={{ fontSize: '1.1rem' }} /> View Dashboard
                    </Button>
                    <Button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <FaUser style={{ fontSize: '1.1rem' }} /> My Profile
                    </Button>
                  </ButtonWrapper>
                </WelcomeCard>

                <QuickStatsGrid>
                  <StatCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h3>Active Courses</h3>
                    <div className="value">5</div>
                  </StatCard>

                  <StatCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h3>Pending Assignments</h3>
                    <div className="value">3</div>
                  </StatCard>

                  <StatCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <h3>Grade Average</h3>
                    <div className="value">A</div>
                  </StatCard>

                  <StatCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <h3>Next Exam</h3>
                    <div className="value">2d</div>
                  </StatCard>
                </QuickStatsGrid>

                <FeaturesSection>
                  <FeatureCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <CardHeader>
                      <strong>My Courses</strong>
                    </CardHeader>
                    <div className="card-content">
                      <h3><FaBook /> Course Explorer</h3>
                      <p>Access all your current courses, class materials, and recorded lectures in one place.</p>
                    </div>
                  </FeatureCard>

                  <FeatureCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <CardHeader>
                      <strong>Schedule</strong>
                    </CardHeader>
                    <div className="card-content">
                      <h3><FaCalendarAlt /> Class Timetable</h3>
                      <p>View your weekly schedule, upcoming classes, exams, and important deadlines.</p>
                    </div>
                  </FeatureCard>

                  <FeatureCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <CardHeader>
                      <strong>Assignments</strong>
                    </CardHeader>
                    <div className="card-content">
                      <h3><FaClipboardList /> Task Manager</h3>
                      <p>Track all your pending assignments, submission deadlines, and graded work.</p>
                    </div>
                  </FeatureCard>

                  <FeatureCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    <CardHeader>
                      <strong>Performance</strong>
                    </CardHeader>
                    <div className="card-content">
                      <h3><FaChartBar /> Academic Progress</h3>
                      <p>Monitor your performance, grades, attendance, and growth over time.</p>
                    </div>
                  </FeatureCard>
                </FeaturesSection>
              </>
            } />
          </Routes>
        </ContentArea>
      </MainContent>
    </HomeContainer>
  );
};

export default Home;
