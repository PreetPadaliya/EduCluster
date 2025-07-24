import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
  background: linear-gradient(120deg, #1a1a2e 0%, #16213e 100%);
`;

const Circle = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: rgba(79, 99, 238, 0.08);
  box-shadow: 0 0 15px rgba(123, 87, 194, 0.1);
`;

const AnimatedBackground = () => {
  // Generate random position for each circle
  const circles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    size: Math.random() * 300 + 50,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 2,
  }));

  return (
    <BackgroundContainer>
      {circles.map(({ id, size, x, y, duration, delay }) => (
        <Circle
          key={id}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${y}%`,
            left: `${x}%`,
          }}
          animate={{
            x: [0, 30, 0, -30, 0],
            y: [0, -20, 10, -10, 0],
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        />
      ))}
    </BackgroundContainer>
  );
};

export default AnimatedBackground;
