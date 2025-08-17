// src/components/HowToUseSection.tsx
import { Check, Shield } from "lucide-react";
import React from "react";

interface Step {
  step: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    step: 1,
    title: "Upload Your PDF",
    description:
      "Simply drag and drop your PDF file onto the designated area or click to select from your device. It's quick and easy!",
  },
  {
    step: 2,
    title: "Choose a Tool",
    description:
      "Browse our intuitive suite of PDF tools. Whether you need to merge, split, convert, or compress, select the right tool for your task.",
  },
  {
    step: 3,
    title: "Apply Changes",
    description:
      "Follow the straightforward on-screen instructions specific to your chosen tool. Our guided process makes complex tasks simple.",
  },
  {
    step: 4,
    title: "Download Result",
    description:
      "Once your PDF is processed, securely download the refined document directly to your computer. Your files are always kept private.",
  },
];
const benefits = [
  "Privacy-first approach - files auto-delete after 1 hour",
  "No registration required",
  "Fast processing with progress indicators",
  "Mobile responsive design",
  "Secure file handling",
  "Instant download links",
];

const HowToUseSection: React.FC = () => {
  return (
    <div>
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple Steps to Get Started
          </h2>

          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {steps.map((item: Step) => (
                <div
                  key={item.step}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Step Number Circle - positioned to overlap the box */}
                  <div className="relative z-20 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xl font-bold text-white shadow-md ring-4 ring-indigo-50 mb-0">
                    {item.step}
                  </div>

                  {/* Content Card - positioned below the circle with negative margin to create overlap */}
                  <div className="relative z-10 -mt-8 flex-grow rounded-xl bg-white p-6 pt-12 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose PDF Tools?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="h-8 w-8 text-primary-600" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Privacy First
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Your files are processed securely and automatically deleted
                  after 1 hour. We never store or access your documents.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 font-medium">
                      100% Secure & Private
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowToUseSection;
