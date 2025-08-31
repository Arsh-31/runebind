"use client";
import React from "react";
import { FileText, User, LogIn, Moon, Sun, Settings } from "lucide-react"; // Import more relevant icons

const Navbar: React.FC = () => {
  return (
    <nav className="bg-[var(--background)] shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {" "}
          {/* Reduced height for sleeker look */}
          {/* Logo & Brand Name */}
          <div className="flex items-center space-x-2 cursor-pointer group">
            <div className="p-2 rounded-lg text-brand-primary-accent group-hover:bg-brand-primary-accent/10 transition-colors">
              <FileText className="w-7 h-7" /> {/* Slightly larger icon */}
            </div>
            <span className="text-xl font-semibold text-foreground group-hover:text-brand-primary-accent transition-colors">
              RuneBind
            </span>
          </div>
          {/* Main Navigation (Feature-Oriented) */}
          <div className="hidden md:flex items-center space-x-6 text-foreground-dark-secondary">
            {" "}
            {/* Hide on small screens */}
            <NavItem label="Merge PDF" href="/merge" />
            <NavItem label="Split PDF" href="/split" />
            <NavItem label="Compress PDF" href="/compress" />{" "}
            {/* Example of another service */}
            <NavItem label="Upload" href="/upload" primary />{" "}
            {/* Direct upload option */}
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavItemProps {
  label: string;
  href: string;
  primary?: boolean; // For a more prominent item like "Upload"
}

const NavItem: React.FC<NavItemProps> = ({ label, href, primary }) => {
  return (
    <a
      href={href}
      className={`flex items-center space-x-1 font-medium transition-colors
        ${
          primary
            ? "px-3 py-1.5 rounded-lg bg-brand-primary-accent text-white hover:bg-brand-primary-accent/90 focus:outline-none focus:ring-2 focus:ring-brand-primary-accent"
            : "text-foreground-dark-secondary hover:text-foreground-dark-primary hover:bg-background-wash px-3 py-1.5 rounded-md"
        }
      `}
    >
      <span className="hidden lg:block">{label}</span>{" "}
      {/* Hide label on smaller md screens */}
    </a>
  );
};

export default Navbar;
