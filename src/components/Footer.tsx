import React from "react";
import { FileText } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <FileText className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">RuneBind</span>
          </div>
          
          <div className="text-sm text-gray-600 text-center md:text-right">
            <p className="mb-2">Professional PDF tools for everyone</p>
            <p>© {new Date().getFullYear()} RuneBind. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
