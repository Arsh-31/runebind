// src/components/HowToUseSection.tsx
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
      "Simply drag and drop your PDF file onto the designated area or click to select from your device. It’s quick and easy!",
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

const HowToUseSection: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Simple Steps to Get Started
        </h2>

        <div className="relative mx-auto max-w-xl">
          {" "}
          {/* Container for the timeline */}
          {/* Vertical Timeline Line */}
          {/* <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-indigo-200"></div> */}
          {steps.map((item: Step) => (
            <div
              key={item.step}
              className="relative mb-12 flex w-full items-center justify-center"
            >
              {/* Step Number Circle */}
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white shadow-md ring-4 ring-indigo-50">
                {item.step}
              </div>

              {/* Content Card */}
              <div className="ml-6 flex-grow rounded-xl bg-white p-6 shadow-lg sm:ml-8">
                <h3 className="text-xl font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToUseSection;
