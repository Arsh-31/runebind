"use client";
import React from "react";
import Link from "next/link";
import { FileText } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg text-blue-600 group-hover:bg-blue-50 transition-colors">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              RuneBind
            </span>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavItem label="Merge PDF" href="/merge-pdf" />
            <NavItem label="Split PDF" href="/split-pdf" />
            <NavItem label="Compress PDF" href="/compress-pdf" />
            <NavItem label="Convert to JPG" href="/pdf-to-jpg" />
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavItemProps {
  label: string;
  href: string;
}

const NavItem: React.FC<NavItemProps> = ({ label, href }) => {
  return (
    <Link
      href={href}
      className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
    >
      {label}
    </Link>
  );
};

export default Navbar;
