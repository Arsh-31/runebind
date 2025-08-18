"use client";
import React, { useState, useEffect } from "react";
import { Menu, FileText } from "lucide-react";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer">
            <div className="p-2 rounded-lg">
              <FileText className="w-6 h-6 text-[var(--brand-midnight)]" />
            </div>
            <span className="text-2xl font-semibold text-[var(--brand-midnight)]">
              RuneBind
            </span>
          </div>

          {/* Navigation Links */}
          {/* <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
            >
              Features
            </a>
            <a
              href="#tools"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
            >
              Tools
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
            >
              Contact
            </a>
          </div> */}

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="px-5 py-2 rounded-md border border-[var(--brand-storm)] text-[var(--brand-midnight)] bg-[var(--brand-cloud)]">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
