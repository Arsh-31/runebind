import React from "react";
import { FileText, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold">RuneBind</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Modern PDF processing tools for merging, splitting, compressing,
              and converting PDFs. Fast, secure, and privacy-focused.
            </p>
          </div>

          {/* Features
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-400">
              <li>PDF Merge</li>
              <li>PDF Split</li>
              <li>PDF Compress</li>
              <li>PDF to JPG</li>
              <li>Privacy First</li>
            </ul>
          </div> */}

          {/* Company
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>About</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Contact</li>
              <li>Support</li>
            </ul>
          </div> */}
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-center items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} PDF Tools. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
