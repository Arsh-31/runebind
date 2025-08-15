"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, FileText, Download, Upload, Settings } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 cursor-pointer group">
            <FileText className="w-5 h-5 text-black" />
            <span className="text-xl font-bold text-black">PDFFlow</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
