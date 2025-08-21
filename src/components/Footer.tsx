import React from "react";
import { FileText, Heart, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-[var(--brand-midnight)] text-[var(--brand-cloud)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-[var(--brand-forest)] rounded-md">
                <FileText className="h-8 w-8 text-[var(--brand-cloud)]" />
              </div>
              <span className="text-2xl font-semibold">RuneBind</span>
            </div>
            <p className="text-[var(--brand-sky)] mb-6 max-w-md text-lg leading-relaxed">
              Modern PDF processing tools for merging, splitting, compressing,
              and converting PDFs. Fast, secure, and privacy-focused.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-3 bg-[var(--brand-cloud)]/5 hover:bg-[var(--brand-cloud)]/10 rounded-md transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Features</h3>
            <ul className="space-y-3">
              {[
                "PDF Merge",
                "PDF Split",
                "PDF Compress",
                "PDF to JPG",
                "Privacy First",
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-[var(--brand-sky)] hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-[var(--brand-forest)] rounded-full mr-3"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              {[
                "About",
                "Privacy Policy",
                "Terms of Service",
                "Contact",
                "Support",
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-[var(--brand-sky)] hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-[var(--brand-forest)] rounded-full mr-3"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div> */}
        </div>

        {/* Bottom */}
        <div className="border-t border-[var(--brand-cloud)]/10 mt-12 pt-8 flex flex-col md:flex-row justify-center items-center">
          <p className="text-[var(--brand-sky)] text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} RuneBind. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
