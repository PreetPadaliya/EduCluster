import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";
import {
  FaUser,
  FaLock,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSignOutAlt,
  FaUserShield,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserTie,
  FaCrown,
} from "react-icons/fa";
import AnimatedBackground from "../components/AnimatedBackground";

const GlobalStyles = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #121214;
    color: #e0e0e0;
  }
`;

const AdminContainer = styled.div`
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
  position: relative;
  z-index: 1;
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
  box-sizing: border-box;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #121214;
  padding: 1.5rem;
  color: #e0e0e0;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(25, 25, 30, 0.8);
  padding: 1.2rem 1.8rem;
  border-radius: 16px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(50, 50, 60, 0.4);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
`;

const Title = styled.h1`
  color: #e0e0e0;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex: 1;
  font-size: 1.8rem;
  background: linear-gradient(135deg, #e0e0e0, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  svg {
    color: #a076f9;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const LogoutButton = styled(motion.button)`
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #ff5252, #d32f2f);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
    transform: translateY(-2px);
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(25, 25, 30, 0.8);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(50, 50, 60, 0.4);
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${(props) =>
    props.accent || "linear-gradient(135deg, #a076f9, #7e57c2)"};
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
    border-color: rgba(160, 118, 249, 0.3);
  }
`;

const StatNumber = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${(props) => props.color || "#a076f9"};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  svg {
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;

    svg {
      font-size: 1rem;
    }
  }
`;

const StatLabel = styled.div`
  color: #a0a0a0;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  line-height: 1.2;
`;

const RequestsContainer = styled.div`
  background: rgba(25, 25, 30, 0.8);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(50, 50, 60, 0.4);

  h2 {
    color: #e0e0e0;
    margin-bottom: 1.5rem;
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;

    svg {
      color: #a076f9;
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const RequestCard = styled(motion.div)`
  background: rgba(30, 30, 35, 0.6);
  border: 1px solid rgba(50, 50, 60, 0.4);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    transform: translateY(-2px);
    border-color: rgba(160, 118, 249, 0.3);
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    padding: 1.2rem;
  }
`;

const RequestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.8rem;
  }
`;

const UserInfo = styled.div`
  flex: 1;
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
`;

const UserName = styled.h3`
  margin: 0;
  color: #e0e0e0;
  font-size: 1.2rem;
  font-weight: 600;
  min-width: 200px;

  @media (max-width: 768px) {
    min-width: auto;
    font-size: 1.1rem;
  }
`;

const UserDetails = styled.div`
  color: #a0a0a0;
  font-size: 0.9rem;
  line-height: 1.4;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.3rem;
  }

  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;

    strong {
      color: #c0c0c0;
      font-weight: 600;
    }
  }
`;

const RoleBadge = styled.span`
  background: ${(props) => {
    switch (props.role?.toLowerCase()) {
      case "principal":
        return "linear-gradient(135deg, #9c27b0, #7b1fa2)";
      case "hod":
        return "linear-gradient(135deg, #673ab7, #512da8)";
      case "faculty":
        return "linear-gradient(135deg, #3f51b5, #303f9f)";
      case "student":
        return "linear-gradient(135deg, #2196f3, #1976d2)";
      default:
        return "linear-gradient(135deg, #666, #424242)";
    }
  }};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;

  @media (max-width: 768px) {
    align-self: flex-start;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 1rem;
  justify-content: flex-end;

  @media (max-width: 768px) {
    justify-content: stretch;
    gap: 0.5rem;
  }
`;

const ActionButton = styled(motion.button)`
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover:before {
    left: 100%;
  }

  background: ${(props) =>
    props.type === "approve"
      ? "linear-gradient(135deg, #4caf50, #2e7d32)"
      : "linear-gradient(135deg, #f44336, #c62828)"};
  color: white;

  &:hover {
    background: ${(props) =>
    props.type === "approve"
      ? "linear-gradient(135deg, #66bb6a, #388e3c)"
      : "linear-gradient(135deg, #ef5350, #d32f2f)"};
    box-shadow: ${(props) =>
    props.type === "approve"
      ? "0 5px 18px rgba(76, 175, 80, 0.4)"
      : "0 5px 18px rgba(244, 67, 54, 0.4)"};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;

    &:hover:before {
      left: -100%;
    }
  }

  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
    font-size: 0.85rem;
    flex: 1;
    justify-content: center;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 1.5rem;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
  z-index: 2;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.5rem 1rem 3.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  color: #ffffff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    border-color: rgba(160, 118, 249, 0.5);
    box-shadow: 0 0 0 3px rgba(160, 118, 249, 0.1);
    transform: translateY(-2px);
    
    + ${InputIcon} {
      color: #a076f9;
      transform: translateY(-50%) scale(1.1);
    }
  }

  &:hover {
    border-color: rgba(160, 118, 249, 0.6);
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #a076f9, #8b5fbf);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(160, 118, 249, 0.3);
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    background: linear-gradient(135deg, #b085ff, #9a6ed4);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(160, 118, 249, 0.4);

    &:before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoginTitle = styled(motion.h1)`
  color: #e0e0e0;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 2rem;
  background: linear-gradient(135deg, #a076f9, #7e57c2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1.5rem;
`;

const ErrorMessage = styled.div`
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 8px;
  padding: 1rem;
  color: #f44336;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #a0a0a0;

  h3 {
    color: #c0c0c0;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }

  p {
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const AdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ id: "", password: "" });
  const [error, setError] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const fetchData = async () => {
    try {
      const [pendingRes, usersRes] = await Promise.all([
        fetch("http://localhost:3001/api/admin/pending-requests"),
        fetch("http://localhost:3001/api/admin/users"),
      ]);

      if (pendingRes.ok && usersRes.ok) {
        const pendingData = await pendingRes.json();
        const usersData = await usersRes.json();

        setPendingRequests(pendingData.requests || []);
        setApprovedUsers(usersData.users || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (data.success) {
        setIsLoggedIn(true);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/admin/approve/${requestId}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  const handleReject = async (requestId) => {
    const reason = prompt("Enter rejection reason (optional):");

    try {
      const response = await fetch(
        `http://localhost:3001/api/admin/reject/${requestId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason }),
        }
      );

      if (response.ok) {
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error("Rejection failed:", error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginData({ id: "", password: "" });
    setPendingRequests([]);
    setApprovedUsers([]);
  };

  if (!isLoggedIn) {
    return (
      <>
        <GlobalStyles />
        <AnimatedBackground />
        <AdminContainer>
          <LoginBox
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <LoginTitle
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FaUserShield /> Admin Login
            </LoginTitle>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <motion.form
              onSubmit={handleLogin}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.3
                  }
                }
              }}
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <InputWrapper>
                  <Input
                    type="text"
                    placeholder="Admin ID (admin123)"
                    value={loginData.id}
                    onChange={(e) =>
                      setLoginData({ ...loginData, id: e.target.value })
                    }
                    required
                  />
                  <InputIcon>
                    <FaUser />
                  </InputIcon>
                </InputWrapper>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <InputWrapper>
                  <Input
                    type="password"
                    placeholder="Password (admin@123)"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                  />
                  <InputIcon>
                    <FaLock />
                  </InputIcon>
                </InputWrapper>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Button type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </motion.div>
            </motion.form>
          </LoginBox>
        </AdminContainer>
      </>
    );
  }

  const stats = {
    pending: pendingRequests.length,
    approved: approvedUsers.length,
    principals: approvedUsers.filter((u) => u.role === "principal").length,
    hods: approvedUsers.filter((u) => u.role === "hod").length,
    faculty: approvedUsers.filter((u) => u.role === "faculty").length,
    students: approvedUsers.filter((u) => u.role === "student").length,
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>
          <FaUserShield /> Admin Dashboard
        </Title>
        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </LogoutButton>
      </Header>

      <StatsContainer>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatNumber color="#ff9800">
            <FaClock /> {stats.pending}
          </StatNumber>
          <StatLabel>Pending Requests</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatNumber color="#4caf50">
            <FaUsers /> {stats.approved}
          </StatNumber>
          <StatLabel>Total Users</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatNumber color="#9c27b0">{stats.principals}</StatNumber>
          <StatLabel>Principals</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatNumber color="#673ab7">{stats.hods}</StatNumber>
          <StatLabel>HODs</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <StatNumber color="#3f51b5">{stats.faculty}</StatNumber>
          <StatLabel>Faculty</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <StatNumber color="#2196f3">{stats.students}</StatNumber>
          <StatLabel>Students</StatLabel>
        </StatCard>
      </StatsContainer>

      <RequestsContainer>
        <h2>
          <FaClock /> Pending Account Requests
        </h2>

        {pendingRequests.length === 0 ? (
          <EmptyState>
            <FaCheckCircle size={48} color="#4caf50" />
            <h3>No Pending Requests</h3>
            <p>All account requests have been processed.</p>
          </EmptyState>
        ) : (
          pendingRequests.map((request, index) => (
            <RequestCard
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <RequestHeader>
                <UserInfo>
                  <UserName>
                    {request.firstName} {request.lastName}
                  </UserName>
                  <UserDetails>
                    <div>
                      <strong>Email:</strong> {request.email}
                    </div>
                    <div>
                      <strong>Phone:</strong> {request.phone}
                    </div>
                    <div>
                      <strong>ID:</strong> {request.userId}
                    </div>
                    <div>
                      <strong>Requested:</strong>{" "}
                      {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                  </UserDetails>
                </UserInfo>
                <RoleBadge role={request.role}>{request.role}</RoleBadge>
              </RequestHeader>

              <ActionButtons>
                <ActionButton
                  type="approve"
                  onClick={() => handleApprove(request.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaCheckCircle /> Approve
                </ActionButton>
                <ActionButton
                  type="reject"
                  onClick={() => handleReject(request.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimesCircle /> Reject
                </ActionButton>
              </ActionButtons>
            </RequestCard>
          ))
        )}
      </RequestsContainer>
    </DashboardContainer>
  );
};

export default AdminPanel;
