import React from 'react';

const TestComponent = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#121214', 
      color: '#e0e0e0', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <h1>Test Component</h1>
      <p>If you can see this, the React app is working!</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default TestComponent;
