import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface DraggableCardProps {
  children: React.ReactNode;
  className?: string;
  initialPosition?: { x: number; y: number };
}

const DraggableCard: React.FC<DraggableCardProps> = ({ children, className, initialPosition }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Position values with spring physics
  const x = useSpring(initialPosition?.x || 0, {
    stiffness: 400,
    damping: 30
  });
  
  const y = useSpring(initialPosition?.y || 0, {
    stiffness: 400,
    damping: 30
  });

  // Transform for rotation based on velocity
  const rotate = useTransform(
    [x, y],
    ([latestX, latestY]) => (latestX + latestY) * 0.05
  );

  // Handle drag with boundaries and bounce
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: { point: { x: number; y: number }, velocity: { x: number; y: number } }) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const cardRect = card.getBoundingClientRect();
    const maxX = window.innerWidth - cardRect.width;
    const maxY = window.innerHeight - cardRect.height;

    let nextX = info.point.x;
    let nextY = info.point.y;
    
    // Add bounce effect when hitting boundaries
    if (nextX < 0) {
      nextX = 0;
      x.set(-20);
      setTimeout(() => x.set(0), 50);
    } else if (nextX > maxX) {
      nextX = maxX;
      x.set(maxX + 20);
      setTimeout(() => x.set(maxX), 50);
    } else {
      x.set(nextX);
    }

    if (nextY < 0) {
      nextY = 0;
      y.set(-20);
      setTimeout(() => y.set(0), 50);
    } else if (nextY > maxY) {
      nextY = maxY;
      y.set(maxY + 20);
      setTimeout(() => y.set(maxY), 50);
    } else {
      y.set(nextY);
    }
  };

  // Update constraints on window resize
  useEffect(() => {
    const handleResize = () => {
      if (!cardRef.current) return;
      
      const card = cardRef.current;
      const cardRect = card.getBoundingClientRect();
      const maxX = window.innerWidth - cardRect.width;
      const maxY = window.innerHeight - cardRect.height;

      // Keep card within bounds after resize
      x.set(Math.min(x.get(), maxX));
      y.set(Math.min(y.get(), maxY));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [x, y]);

  return (
    <motion.div
      ref={cardRef}
      drag
      dragMomentum={true}
      dragElastic={0.3}
      onDrag={handleDrag}
      style={{ x, y, rotate }}
      whileDrag={{ 
        scale: 1.02,
        cursor: 'grabbing',
        transition: { duration: 0.2 }
      }}
      className={`absolute cursor-grab touch-none ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default DraggableCard;