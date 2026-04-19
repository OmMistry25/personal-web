import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="py-8">
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="text-lg no-underline">
            Om Mistry
          </NavLink>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/projects" 
              className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}
            >
              Projects
            </NavLink>
            <NavLink 
              to="/writing" 
              className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}
            >
              Writing
            </NavLink>
            <NavLink 
              to="/now" 
              className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}
            >
              Now
            </NavLink>
            <NavLink 
              to="/contact" 
              className="text-ink-900 no-underline hover:underline underline-offset-4"
            >
              Contact
            </NavLink>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-ink-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-ink-100 mt-8">
          <nav className="container-custom py-8 flex flex-col space-y-6">
            <NavLink 
              to="/projects" 
              className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </NavLink>
            <NavLink 
              to="/writing" 
              className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}
              onClick={() => setIsMenuOpen(false)}
            >
              Writing
            </NavLink>
            <NavLink 
              to="/now" 
              className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}
              onClick={() => setIsMenuOpen(false)}
            >
              Now
            </NavLink>
            <NavLink 
              to="/contact" 
              className="text-ink-900 no-underline hover:underline underline-offset-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;