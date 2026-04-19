import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const Home: React.FC = () => {
  return (
    <PageTransition>
      <div className="h-screen flex flex-col justify-center">
        <div className="container-custom">
          <h1 className="text-4xl sm:text-5xl mb-20 font-light">
            I build simple things that matter.
          </h1>

          <div className="space-y-6">
            <Link 
              to="/about" 
              className="block group"
            >
              <h2 className="text-6xl sm:text-7xl font-light tracking-tight text-neutral-200 transition-colors duration-500 group-hover:text-neutral-900">
                About
              </h2>
            </Link>

            <Link 
              to="/projects" 
              className="block group"
            >
              <h2 className="text-6xl sm:text-7xl font-light tracking-tight text-neutral-200 transition-colors duration-500 group-hover:text-neutral-900">
                Projects
              </h2>
            </Link>

            <Link 
              to="/writing" 
              className="block group"
            >
              <h2 className="text-6xl sm:text-7xl font-light tracking-tight text-neutral-200 transition-colors duration-500 group-hover:text-neutral-900">
                Writing
              </h2>
            </Link>

            <Link 
              to="/work" 
              className="block group"
            >
              <h2 className="text-6xl sm:text-7xl font-light tracking-tight text-neutral-200 transition-colors duration-500 group-hover:text-neutral-900">
                Work
              </h2>
            </Link>

            <Link 
              to="/now" 
              className="block group"
            >
              <h2 className="text-6xl sm:text-7xl font-light tracking-tight text-neutral-200 transition-colors duration-500 group-hover:text-neutral-900">
                Now
              </h2>
            </Link>

            <Link 
              to="/contact" 
              className="block group"
            >
              <h2 className="text-6xl sm:text-7xl font-light tracking-tight text-neutral-200 transition-colors duration-500 group-hover:text-neutral-900">
                Contact
              </h2>
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Home;