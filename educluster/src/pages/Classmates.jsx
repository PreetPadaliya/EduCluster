import React, { useState, useEffect, useRef } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";
import {
    FaUserFriends,
    FaSearch,
    FaEllipsisV,
    FaPaperPlane,
    FaSmile,
    FaVideo,
    FaPhone,
    FaUserPlus,
    FaUsers,
    FaCircle,
    FaPaperclip,
    FaMicrophone,
    FaImage,
    FaTimes
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

const ClassmatesContainer = styled.div`
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

const ContentWrapper = styled.div`
  display: flex;
  gap: 1.5rem;
  height: calc(90vh - 100px);
  
  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
  }
`;

const ContactsList = styled.div`
  width: 400px;
  flex: 0 0 auto;
  background: rgba(25, 25, 30, 0.8);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 1024px) {
    width: 100%;
    max-height: 300px;
  }
`;

const ContactsHeader = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(50, 50, 60, 0.4);
  
  h2 {
    margin: 0;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      color: #A076F9;
    }
  }
  
  .actions {
    display: flex;
    gap: 0.5rem;
    
    button {
      width: 32px;
      height: 32px;
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
`;

const ContactsSearchBox = styled.div`
  padding: 0.8rem;
  
  input {
    width: 100%;
    padding: 0.6rem 1rem;
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
`;

const ContactsListContent = styled.div`
  flex: 1;
  overflow-y: auto;
  
  /* Hide scrollbar but allow scrolling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(160, 118, 249, 0.3);
    border-radius: 10px;
  }
`;

const ContactItem = styled(motion.div)`
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  border-left: ${props => props.active ? '3px solid #A076F9' : '3px solid transparent'};
  background: ${props => props.active ? 'rgba(160, 118, 249, 0.1)' : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(40, 40, 45, 0.6);
  }
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #A076F9, #7E57C2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: white;
    position: relative;
    
    .status {
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      bottom: 0;
      right: 0;
      border: 2px solid #19191E;
      
      &.online {
        background: #4CAF50;
      }
      
      &.offline {
        background: #9e9e9e;
      }
      
      &.busy {
        background: #F44336;
      }
    }
  }
  
  .info {
    flex: 1;
    
    .name {
      font-weight: 500;
      margin-bottom: 0.2rem;
    }
    
    .last-message {
      font-size: 0.8rem;
      color: #a0a0a0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 180px;
    }
  }
  
  .time {
    font-size: 0.75rem;
    color: #808080;
    align-self: flex-start;
  }
`;

const ChatArea = styled.div`
  flex: 1;
  background: rgba(25, 25, 30, 0.8);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(50, 50, 60, 0.4);
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #A076F9, #7E57C2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: white;
      position: relative;
      
      .status {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        bottom: 0;
        right: 0;
        border: 2px solid #19191E;
        
        &.online {
          background: #4CAF50;
        }
      }
    }
    
    .info {
      .name {
        font-weight: 500;
        margin-bottom: 0.2rem;
      }
      
      .status-text {
        font-size: 0.8rem;
        color: #a0a0a0;
        display: flex;
        align-items: center;
        gap: 0.3rem;
        
        svg {
          color: #4CAF50;
          font-size: 0.6rem;
        }
      }
    }
  }
  
  .actions {
    display: flex;
    gap: 0.8rem;
    
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
`;

const ChatContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  
  /* Hide scrollbar but allow scrolling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(160, 118, 249, 0.3);
    border-radius: 10px;
  }
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 0.8rem 1rem;
  border-radius: 18px;
  margin-bottom: 1rem;
  position: relative;
  
  &.outgoing {
    align-self: flex-end;
    background: linear-gradient(135deg, rgba(160, 118, 249, 0.8), rgba(126, 87, 194, 0.8));
    border-bottom-right-radius: 4px;
    
    .time {
      color: rgba(255, 255, 255, 0.7);
    }
  }
  
  &.incoming {
    align-self: flex-start;
    background: rgba(40, 40, 45, 0.8);
    border-bottom-left-radius: 4px;
  }
  
  .message-content {
    margin-bottom: 0.3rem;
  }
  
  .time {
    font-size: 0.7rem;
    color: #a0a0a0;
    text-align: right;
  }
`;

const DateDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  
  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: rgba(160, 118, 249, 0.3);
  }
  
  .date {
    padding: 0 1rem;
    font-size: 0.8rem;
    color: #a0a0a0;
  }
`;

const ChatInputArea = styled.div`
  padding: 1rem;
  border-top: 1px solid rgba(50, 50, 60, 0.4);
`;

const ChatInput = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  position: relative;
  
  .attachments {
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
  
  .input-wrapper {
    flex: 1;
    position: relative;
    
    input {
      width: 100%;
      padding: 0.8rem 1rem;
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
  }
  
  .send-button {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, #A076F9, #7E57C2);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(126, 87, 194, 0.4);
    }
    
    svg {
      margin-left: 2px;
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
    
    input, select {
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

// Sample classmates data
const classmatesData = [
    {
        id: 1,
        name: "Alex Johnson",
        avatar: "AJ",
        status: "online",
        lastMessage: "Did you complete the assignment?",
        lastMessageTime: "10:30 AM",
        messages: [
            {
                id: 1,
                content: "Hey, how's the study going?",
                timestamp: "10:15 AM",
                outgoing: false
            },
            {
                id: 2,
                content: "Pretty good, just finishing up the math problems.",
                timestamp: "10:18 AM",
                outgoing: true
            },
            {
                id: 3,
                content: "Did you complete the assignment?",
                timestamp: "10:30 AM",
                outgoing: false
            }
        ]
    },
    {
        id: 2,
        name: "Emma Wilson",
        avatar: "EW",
        status: "busy",
        lastMessage: "Can you send me your notes from yesterday?",
        lastMessageTime: "Yesterday",
        messages: [
            {
                id: 1,
                content: "Hi Emma, do you have time to study together?",
                timestamp: "Yesterday, 3:45 PM",
                outgoing: true
            },
            {
                id: 2,
                content: "I'm busy with piano lessons until 6, can we do it after that?",
                timestamp: "Yesterday, 4:00 PM",
                outgoing: false
            },
            {
                id: 3,
                content: "Can you send me your notes from yesterday?",
                timestamp: "Yesterday, 4:05 PM",
                outgoing: false
            }
        ]
    },
    {
        id: 3,
        name: "Michael Chen",
        avatar: "MC",
        status: "online",
        lastMessage: "Thanks for helping with the project",
        lastMessageTime: "Yesterday",
        messages: [
            {
                id: 1,
                content: "I've completed the presentation slides",
                timestamp: "Yesterday, 2:15 PM",
                outgoing: false
            },
            {
                id: 2,
                content: "Great! I'll review them and add my section",
                timestamp: "Yesterday, 2:20 PM",
                outgoing: true
            },
            {
                id: 3,
                content: "Thanks for helping with the project",
                timestamp: "Yesterday, 2:30 PM",
                outgoing: false
            }
        ]
    },
    {
        id: 4,
        name: "Sarah Davis",
        avatar: "SD",
        status: "offline",
        lastMessage: "See you tomorrow in class",
        lastMessageTime: "Monday",
        messages: [
            {
                id: 1,
                content: "Did you understand the physics homework?",
                timestamp: "Monday, 8:30 PM",
                outgoing: true
            },
            {
                id: 2,
                content: "Yes, problem 3 was tricky but I figured it out",
                timestamp: "Monday, 9:00 PM",
                outgoing: false
            },
            {
                id: 3,
                content: "See you tomorrow in class",
                timestamp: "Monday, 9:15 PM",
                outgoing: false
            }
        ]
    },
    {
        id: 5,
        name: "Study Group",
        avatar: "SG",
        status: "online",
        lastMessage: "Jason: Let's meet at the library at 4pm",
        lastMessageTime: "2 days ago",
        isGroup: true,
        messages: [
            {
                id: 1,
                content: "Who's free to study for the midterm this weekend?",
                timestamp: "2 days ago, 3:15 PM",
                outgoing: true
            },
            {
                id: 2,
                sender: "Emily",
                content: "I can do Saturday afternoon",
                timestamp: "2 days ago, 3:20 PM",
                outgoing: false
            },
            {
                id: 3,
                sender: "Jason",
                content: "Let's meet at the library at 4pm",
                timestamp: "2 days ago, 3:45 PM",
                outgoing: false
            }
        ]
    }
];

const Classmates = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClassmate, setSelectedClassmate] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newContact, setNewContact] = useState({ name: "", email: "" });
    const [classmates, setClassmates] = useState(classmatesData);

    const chatContentRef = useRef(null);

    // Effect to scroll chat to bottom when messages change
    useEffect(() => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
        }
    }, [messages]);

    // Set messages when selected classmate changes
    useEffect(() => {
        if (selectedClassmate) {
            setMessages(selectedClassmate.messages || []);
        } else {
            setMessages([]);
        }
    }, [selectedClassmate]);

    // Filter classmates based on search term
    const filteredClassmates = classmates.filter(classmate =>
        classmate.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle sending a new message
    const handleSendMessage = () => {
        if (!messageInput.trim() || !selectedClassmate) return;

        const newMessage = {
            id: messages.length + 1,
            content: messageInput,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            outgoing: true
        };

        // Update messages state
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);

        // Update classmates with new message
        const updatedClassmates = classmates.map(classmate => {
            if (classmate.id === selectedClassmate.id) {
                return {
                    ...classmate,
                    messages: updatedMessages,
                    lastMessage: messageInput,
                    lastMessageTime: "Just now"
                };
            }
            return classmate;
        });

        setClassmates(updatedClassmates);

        // Update selected classmate
        setSelectedClassmate({
            ...selectedClassmate,
            messages: updatedMessages,
            lastMessage: messageInput,
            lastMessageTime: "Just now"
        });

        // Clear input
        setMessageInput("");

        // Simulate response after 1-3 seconds
        if (Math.random() > 0.3) { // 70% chance of getting a response
            const delay = 1000 + Math.random() * 2000;

            setTimeout(() => {
                const responses = [
                    "Got it, thanks!",
                    "I'll check that out.",
                    "That makes sense.",
                    "Cool! Let me know if you need anything else.",
                    "Thanks for the info!",
                    "I'll get back to you on that soon.",
                    "Perfect, that works for me.",
                    "I appreciate your help!",
                ];

                const responseMessage = {
                    id: updatedMessages.length + 1,
                    content: responses[Math.floor(Math.random() * responses.length)],
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    outgoing: false
                };

                const newUpdatedMessages = [...updatedMessages, responseMessage];

                // Update messages state
                setMessages(newUpdatedMessages);

                // Update classmates with new message
                const newUpdatedClassmates = classmates.map(classmate => {
                    if (classmate.id === selectedClassmate.id) {
                        return {
                            ...classmate,
                            messages: newUpdatedMessages,
                            lastMessage: responseMessage.content,
                            lastMessageTime: "Just now"
                        };
                    }
                    return classmate;
                });

                setClassmates(newUpdatedClassmates);

                // Update selected classmate
                setSelectedClassmate({
                    ...selectedClassmate,
                    messages: newUpdatedMessages,
                    lastMessage: responseMessage.content,
                    lastMessageTime: "Just now"
                });
            }, delay);
        }
    };

    // Handle adding a new contact
    const handleAddContact = () => {
        if (!newContact.name.trim()) return;

        const newClassmate = {
            id: classmates.length + 1,
            name: newContact.name,
            avatar: newContact.name.split(" ").map(n => n[0]).join("").toUpperCase(),
            status: "offline",
            lastMessage: "New contact added",
            lastMessageTime: "Just now",
            messages: []
        };

        setClassmates([...classmates, newClassmate]);
        setNewContact({ name: "", email: "" });
        setShowAddModal(false);
    };

    return (
        <ClassmatesContainer>
            <GlobalStyles />

            <Header>
                <h1><FaUserFriends /> Classmates</h1>
                <SearchInputWrapper>
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Search classmates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </SearchInputWrapper>
            </Header>

            <ContentWrapper>
                <ContactsList>
                    <ContactsHeader>
                        <h2><FaUserFriends /> Chats</h2>
                        <div className="actions">
                            <button onClick={() => setShowAddModal(true)}>
                                <FaUserPlus />
                            </button>
                            <button>
                                <FaEllipsisV />
                            </button>
                        </div>
                    </ContactsHeader>

                    <ContactsSearchBox>
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </ContactsSearchBox>

                    <ContactsListContent>
                        {filteredClassmates.map((classmate) => (
                            <ContactItem
                                key={classmate.id}
                                active={selectedClassmate && selectedClassmate.id === classmate.id}
                                onClick={() => setSelectedClassmate(classmate)}
                                whileHover={{ x: 3 }}
                            >
                                <div className="avatar">
                                    {classmate.isGroup ? <FaUsers /> : classmate.avatar}
                                    <div className={`status ${classmate.status}`}></div>
                                </div>
                                <div className="info">
                                    <div className="name">{classmate.name}</div>
                                    <div className="last-message">{classmate.lastMessage}</div>
                                </div>
                                <div className="time">{classmate.lastMessageTime}</div>
                            </ContactItem>
                        ))}

                        {filteredClassmates.length === 0 && (
                            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#a0a0a0' }}>
                                No conversations found
                            </div>
                        )}
                    </ContactsListContent>
                </ContactsList>

                <ChatArea>
                    {selectedClassmate ? (
                        <>
                            <ChatHeader>
                                <div className="user-info">
                                    <div className="avatar">
                                        {selectedClassmate.isGroup ? <FaUsers /> : selectedClassmate.avatar}
                                        <div className={`status ${selectedClassmate.status}`}></div>
                                    </div>
                                    <div className="info">
                                        <div className="name">{selectedClassmate.name}</div>
                                        <div className="status-text">
                                            {selectedClassmate.status === "online" && (
                                                <>
                                                    <FaCircle /> Online
                                                </>
                                            )}
                                            {selectedClassmate.status === "busy" && "Busy"}
                                            {selectedClassmate.status === "offline" && "Offline"}
                                        </div>
                                    </div>
                                </div>
                                <div className="actions">
                                    <button>
                                        <FaPhone />
                                    </button>
                                    <button>
                                        <FaVideo />
                                    </button>
                                    <button>
                                        <FaEllipsisV />
                                    </button>
                                </div>
                            </ChatHeader>

                            <ChatContent ref={chatContentRef}>
                                <DateDivider>
                                    <div className="date">Today</div>
                                </DateDivider>

                                {messages.map((message) => (
                                    <MessageBubble
                                        key={message.id}
                                        className={message.outgoing ? "outgoing" : "incoming"}
                                    >
                                        {message.sender && !message.outgoing && (
                                            <div style={{
                                                fontSize: '0.7rem',
                                                fontWeight: '600',
                                                marginBottom: '0.2rem',
                                                color: '#A076F9'
                                            }}>
                                                {message.sender}
                                            </div>
                                        )}
                                        <div className="message-content">{message.content}</div>
                                        <div className="time">{message.timestamp}</div>
                                    </MessageBubble>
                                ))}
                            </ChatContent>

                            <ChatInputArea>
                                <ChatInput>
                                    <div className="attachments">
                                        <button>
                                            <FaPaperclip />
                                        </button>
                                        <button>
                                            <FaImage />
                                        </button>
                                    </div>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            placeholder="Type a message..."
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        />
                                    </div>
                                    <button className="send-button" onClick={handleSendMessage}>
                                        <FaPaperPlane />
                                    </button>
                                </ChatInput>
                            </ChatInputArea>
                        </>
                    ) : (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            padding: '2rem'
                        }}>
                            <FaUserFriends style={{ fontSize: '3rem', color: '#A076F9', marginBottom: '1rem' }} />
                            <h2>Select a classmate to start chatting</h2>
                            <p style={{ color: '#a0a0a0', textAlign: 'center' }}>
                                Connect with your classmates, share study resources, and collaborate on projects.
                            </p>
                            <Button
                                primary
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                style={{ marginTop: '1.5rem' }}
                                onClick={() => setShowAddModal(true)}
                            >
                                <FaUserPlus /> Add New Classmate
                            </Button>
                        </div>
                    )}
                </ChatArea>
            </ContentWrapper>

            {/* Add Contact Modal */}
            {showAddModal && (
                <ModalBackdrop
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowAddModal(false)}
                >
                    <ModalContent
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2><FaUserPlus /> Add New Classmate</h2>
                            <Button
                                style={{ padding: '0.5rem', minWidth: 'unset', width: '32px', height: '32px' }}
                                onClick={() => setShowAddModal(false)}
                            >
                                <FaTimes />
                            </Button>
                        </div>

                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={newContact.name}
                                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                                placeholder="Enter classmate's name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email (Optional)</label>
                            <input
                                type="email"
                                value={newContact.email}
                                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                                placeholder="Enter classmate's email"
                            />
                        </div>

                        <div className="form-group">
                            <label>Class</label>
                            <select>
                                <option value="">Select shared class</option>
                                <option value="math">Mathematics</option>
                                <option value="science">Science</option>
                                <option value="history">History</option>
                                <option value="literature">Literature</option>
                                <option value="programming">Programming</option>
                            </select>
                        </div>

                        <div className="modal-actions">
                            <Button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setShowAddModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                primary
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleAddContact}
                                disabled={!newContact.name.trim()}
                                style={{ opacity: !newContact.name.trim() ? 0.7 : 1 }}
                            >
                                <FaUserPlus /> Add Classmate
                            </Button>
                        </div>
                    </ModalContent>
                </ModalBackdrop>
            )}
        </ClassmatesContainer>
    );
};

export default Classmates;
