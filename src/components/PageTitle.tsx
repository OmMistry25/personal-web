import React, { useEffect, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageTitleProps {
  title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  const [noise, setNoise] = useState(0);
  const controls = useAnimationControls();

  useEffect(() => {
    let frame: number;
    
    const animate = () => {
      // Generate smooth noise value between 8 and 12
      const newNoise = 8 + Math.sin(Date.now() * 0.001) * 2;
      setNoise(newNoise);
      frame = requestAnimationFrame(animate);
    };
    
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    controls.start({
      filter: `blur(${noise}px)`,
      transition: { duration: 0.5 }
    });
  }, [noise, controls]);

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="relative"
        >
          <motion.h1
            animate={controls}
            className="text-[12vw] font-light text-neutral-900/[0.03] select-none text-center"
          >
            {title}
          </motion.h1>
          <motion.h1
            className="absolute inset-0 text-[12vw] font-light text-neutral-900/[0.02] select-none text-center mix-blend-overlay"
            style={{ 
              filter: `blur(${noise * 1.5}px)`,
              transform: `scale(${1 + (noise - 8) * 0.001})`
            }}
          >
            {title}
          </motion.h1>
        </motion.div>
      </div>

      <motion.div
        className="fixed top-8 left-8 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link 
          to="/"
          className="block bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
        >
          <Home className="w-5 h-5 text-neutral-600" />
        </Link>
      </motion.div>
    </>
  );
};

export default PageTitle;