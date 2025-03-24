import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logo from '../assets/logo2.jpg';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      setIsVisible(false); // Hide header when scrolling down
    } else {
      setIsVisible(true); // Show header when scrolling up
    }
    setLastScrollY(window.scrollY);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeMobileMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [lastScrollY]);

  const navigateToGames = () => {
    navigate('/games');
    closeMobileMenu();
  };
  const navigateToAbout = () => {
    navigate('/About');
    closeMobileMenu();
  };
  const navigateToContact = () => {
    navigate('/Contact');
    closeMobileMenu();
  };
  const navigateToT_C = () => {
    navigate('/T&C');
    closeMobileMenu();
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 backdrop-blur-md transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ backgroundColor: 'transparent' }}
      >
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="Yono Logo" className="h-12 md:h-16" />
          </Link>

          {/* Hamburger Menu for Mobile */}
          <button
            ref={buttonRef}
            className="md:hidden text-yellow-400 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex gap-6 lg:gap-10">
            <a
              href="/"
              className="text-yellow-400 hover:text-yellow-600 transition-colors relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
            </a>
            <a
              onClick={navigateToAbout}
              className="text-yellow-400 hover:text-yellow-600 transition-colors relative group cursor-pointer"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
            </a>
            <a
              onClick={navigateToT_C}
              className="text-yellow-400 hover:text-yellow-600 transition-colors relative group cursor-pointer"
            >
              T&C
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
            </a>
            <a
              onClick={navigateToContact}
              className="text-yellow-400 hover:text-yellow-600 transition-colors relative group cursor-pointer"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
            </a>
            <button
              onClick={navigateToGames}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-colors text-sm lg:text-base"
            >
              All Apps
            </button>
          </div>
        </nav>

        {/* Mobile Menu with Animation */}
        <div
          ref={menuRef}
          className={`md:hidden mt-4 overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <a
            href="/"
            className="block py-2 text-yellow-400 hover:text-yellow-600 transition-colors relative group"
            onClick={closeMobileMenu}
          >
            Home
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
          </a>
          <a
            onClick={() => {
              toggleMobileMenu();
              navigateToAbout();
            }}
            className="block py-2 text-yellow-400 hover:text-yellow-600 transition-colors relative group cursor-pointer"
          >
            About
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
          </a>
          <a
            onClick={() => {
              toggleMobileMenu();
              navigateToT_C();
            }}
            className="block py-2 text-yellow-400 hover:text-yellow-600 transition-colors relative group cursor-pointer"
          >
            T&C
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
          </a>
          <a
            onClick={() => {
              toggleMobileMenu();
              navigateToContact();
            }}
            className="block py-2 text-yellow-400 hover:text-yellow-600 transition-colors relative group cursor-pointer"
          >
            Contact
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
          </a>
          <button
            onClick={() => {
              toggleMobileMenu();
              navigateToGames();
            }}
            className="block w-full text-left py-2 text-yellow-400 hover:text-yellow-600 transition-colors relative group"
          >
            All Apps
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
          </button>
        </div>
      </header>

      {/* Add padding to prevent content overlap */}
      <div className="pt-20 md:pt-24"></div>
    </>
  );
};

export default Header;