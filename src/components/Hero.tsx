// src/components/HeroSection.jsx
import React from "react";
import GlowingDot from "./Star";

const Hero = () => {
  return (
    <section className="relative py-15 md:py-22 bg-[var(--background)]">
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 text-center max-w-6xl">
        {/* Eyebrow */}
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-[#4f4f4f] mb-8">
          <span className="w-1.5 h-1.5 bg-[#ffffff] rounded-full mr-2"></span>
          <span className="text-sm font-medium">Professional PDF tools</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6">
          Effortless PDF Management
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-3xl text-xl md:text-xl text-[#adadad] leading-relaxed">
          A sober, reliable suite of PDF tools built for professionals. No
          clutter, no noise - just the essentials.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button className="px-8 py-3 bg-[#fff] text-[#141414] font-bold rounded-full">
            Get Started
          </button>
        </div>

        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center p-6 bg-[var(--card)] rounded-2xl">
            <div className="w-12 h-12 bg-[#4f4f4f] rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Fast Processing</h3>
            <p className="text-sm text-[#adadad] text-center">
              Process PDFs in seconds
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-[var(--card)] rounded-2xl">
            <div className="w-12 h-12 bg-[#4f4f4f] rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Privacy First</h3>
            <p className="text-sm text-[#adadad] text-center">
              Files auto-delete after 1 hour
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-[var(--card)] rounded-2xl">
            <div className="w-12 h-12 bg-[#4f4f4f] rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Works Everywhere</h3>
            <p className="text-sm text-[#adadad] text-center">
              Seamless on all devices
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
