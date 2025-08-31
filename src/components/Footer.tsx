import React from "react";
import { FileText, Heart, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Bottom */}
        <div className="border-t-2 border-[var(--card)] pt-8 flex flex-col md:flex-row justify-center items-center">
          <p className="text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} RuneBind. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
