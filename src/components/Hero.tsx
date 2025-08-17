// src/components/HeroSection.jsx
import React from "react";

const Hero = () => {
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        {/* Floating circles */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-purple-200 rounded-full opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-pink-200 rounded-full opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 text-center max-w-6xl">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-200 shadow-lg mb-8">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          <span className="text-sm font-medium text-gray-700">Trusted by 10,000+ users worldwide</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
          <span className="text-blue-600">Effortlessly</span>
          <br />
          <span className="text-gray-900">Manage Your PDFs</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-3xl text-xl md:text-2xl text-gray-600 leading-relaxed">
          Transform your document workflow with our{" "}
          <span className="font-semibold text-gray-800">powerful suite of PDF tools</span>. 
          Fast, secure, and designed for the modern professional.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            Get Started Free
          </button>
          
          <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transform hover:-translate-y-1 transition-all duration-300">
            Watch Demo
          </button>
        </div>

        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Lightning Fast</h3>
            <p className="text-sm text-gray-600 text-center">Process PDFs in seconds, not minutes</p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">100% Secure</h3>
            <p className="text-sm text-gray-600 text-center">Your files are encrypted and auto-deleted</p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Mobile Ready</h3>
            <p className="text-sm text-gray-600 text-center">Works perfectly on all devices</p>
          </div>
        </div>

        {/* Social proof */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 mb-4">Trusted by professionals at</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="w-20 h-8 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-20 h-8 bg-gray-300 rounded animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="w-20 h-8 bg-gray-300 rounded animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="w-20 h-8 bg-gray-300 rounded animate-pulse" style={{animationDelay: '1.5s'}}></div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg className="relative block w-full h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="white"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
