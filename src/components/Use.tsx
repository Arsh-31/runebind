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
      "Simply drag and drop your PDF file onto the designated area or click to select from your device.",
  },
  {
    step: 2,
    title: "Choose a Tool",
    description:
      "Browse our suite of PDF tools. Whether you need to merge, split, convert, or compress, select the right tool.",
  },
  {
    step: 3,
    title: "Apply Changes",
    description:
      "Follow the straightforward on-screen instructions specific to your chosen tool. Our guided process makes it simple.",
  },
  {
    step: 4,
    title: "Download Result",
    description:
      "Once your PDF is processed, securely download the refined document directly to your computer.",
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple Steps to Get Started
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get up and running with our PDF tools in just a few simple steps.
              No complex setup required.
            </p>
          </div>

          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((item: Step) => (
                <div
                  key={item.step}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Step Number Circle */}
                  <div className="relative z-20 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f67e32] text-white text-lg font-semibold mb-4">
                    {item.step}
                  </div>

                  {/* Content Card */}
                  <div className="card text-center h-full">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Why Choose RuneBind?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="p-1 bg-green-100 rounded-lg mt-1">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 leading-relaxed">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="card">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-[#f67e32]/10 rounded-lg">
                    <Shield className="h-6 w-6 text-[#f67e32]" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Privacy First
                  </h3>
                </div>
                <p className="mb-6 text-gray-600 leading-relaxed">
                  Your files are processed securely and automatically deleted
                  after 1 hour. We never store or access your documents.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-1 bg-blue-100 rounded">
                      <Check className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-blue-900">
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
