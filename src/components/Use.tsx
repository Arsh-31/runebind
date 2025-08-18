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
      <section className="py-20 md:py-32 bg-[var(--brand-cream)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-[var(--brand-midnight)] mb-6">
              Simple Steps to Get Started
            </h2>
            <p className="text-xl text-[var(--brand-storm)] max-w-3xl mx-auto">
              Get up and running with our PDF tools in just a few simple steps.
              No complex setup required.
            </p>
          </div>

          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {steps.map((item: Step) => (
                <div
                  key={item.step}
                  className="relative flex flex-col items-center text-center group"
                >
                  {/* Step Number Circle - positioned to overlap the box */}
                  <div className="relative z-20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand-forest)] text-xl font-semibold text-[var(--brand-cloud)] mb-0">
                    {item.step}
                  </div>

                  {/* Content Card - positioned below the circle with negative margin to create overlap */}
                  <div className="relative z-10 -mt-6 flex-grow rounded-md bg-[var(--brand-cloud)] p-8 pt-12 border border-[var(--brand-storm)]">
                    <h3 className="text-xl font-semibold text-[var(--brand-midnight)] mb-3">
                      {item.title}
                    </h3>
                    <p className="text-[var(--brand-storm)] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--brand-cloud)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-semibold text-[var(--brand-midnight)] mb-8">
                Why Choose RuneBind?
              </h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="p-2 bg-[var(--brand-sky)] rounded-md">
                      <Check className="h-5 w-5 text-[var(--brand-midnight)]" />
                    </div>
                    <span className="text-[var(--brand-storm)] text-lg leading-relaxed">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-[var(--brand-cream)] rounded-md p-10 border border-[var(--brand-storm)]">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-[var(--brand-forest)] rounded-sm">
                    <Shield className="h-8 w-8 text-[var(--brand-cloud)]" />
                  </div>
                  <h3 className="text-3xl font-semibold text-[var(--brand-midnight)]">
                    Privacy First
                  </h3>
                </div>
                <p className="text-[var(--brand-storm)] mb-8 text-lg leading-relaxed">
                  Your files are processed securely and automatically deleted
                  after 1 hour. We never store or access your documents.
                </p>
                <div className="bg-[var(--brand-cloud)] border border-[var(--brand-storm)] rounded-sm p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[var(--brand-forest)] rounded-sm">
                      <Check className="h-5 w-5 text-[var(--brand-cloud)]" />
                    </div>
                    <span className="text-[var(--brand-midnight)] font-medium text-lg">
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
