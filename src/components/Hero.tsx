// src/components/HeroSection.jsx
import React from "react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        {/* Abstract background shapes */}
        <div className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-indigo-200 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-purple-200 opacity-20 blur-3xl"></div>

        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Effortlessly Manage Your PDFs
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600">
          Simplify your document workflow with our powerful and intuitive PDF
          tools. Fast, secure, and user-friendly.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <button className="rounded-full bg-indigo-600 px-8 py-3 font-semibold text-white shadow-lg transition duration-300 ease-in-out hover:bg-indigo-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300">
            Get Started Free
          </button>
          <button className="rounded-full border border-gray-300 bg-white px-8 py-3 font-semibold text-gray-700 shadow-md transition duration-300 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
