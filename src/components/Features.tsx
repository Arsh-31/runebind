"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  BriefcaseConveyorBelt,
  Computer,
  Edit,
  Merge,
  Proportions,
  Split,
} from "lucide-react";

// Define the interface for a Feature object
interface Feature {
  name: string;
  description: string;
  icon: string | React.ReactNode; // Accepts string or React element
  route: string; // Route to navigate to
  gradient: string; // Add gradient class for each feature
}

// Define props for IconPlaceholder (if it were to receive props)
interface IconPlaceholderProps {
  children: React.ReactNode;
}

const IconPlaceholder: React.FC<IconPlaceholderProps> = ({ children }) => (
  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--brand-sky)] text-[var(--brand-midnight)]">
    {children}
  </div>
);

const size = 20;

const features: Feature[] = [
  // Explicitly type the features array
  {
    name: "Merge PDFs",
    description: "Combine multiple PDF documents into a single, cohesive file.",
    icon: <Merge size={size} />, // Replace with an actual icon
    route: "/merge-pdf",
    gradient: "",
  },
  {
    name: "Split PDFs",
    description: "Extract specific pages or ranges from your PDFs with ease.",
    icon: <Split size={size} />, // Replace with an actual icon
    route: "/split-pdf",
    gradient: "",
  },
  {
    name: "Convert to PDF",
    description: "Transform various file formats into professional PDFs.",
    icon: <BriefcaseConveyorBelt size={size} />, // Replace with an actual icon
    route: "/pdf-to-jpg",
    gradient: "",
  },
  {
    name: "Edit PDFs",
    description: "Make quick edits to text, images, and pages directly.",
    icon: <Edit size={size} />, // Replace with an actual icon
    route: "/edit-pdf",
    gradient: "",
  },
  {
    name: "Compress PDFs",
    description: "Reduce file size without compromising document quality.",
    icon: <Computer size={size} />, // Replace with an actual icon
    route: "/compress-pdf",
    gradient: "",
  },
  {
    name: "Protect PDFs",
    description: "Add passwords and encryption to secure your sensitive files.",
    icon: <Proportions size={size} />, // Replace with an actual icon
    route: "/protect-pdf",
    gradient: "",
  },
];

const FeatureGrid: React.FC = () => {
  const router = useRouter();

  const handleFeatureClick = (route: string) => {
    router.push(route);
  };

  return (
    <section className="py-20 md:py-32 bg-[var(--brand-cloud)]">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-[color:var(--brand-midnight)] mb-6">
            Essential PDF Tools
          </h2>
          <p className="text-xl text-[color:var(--brand-storm)] max-w-3xl mx-auto">
            Everything you need to work with PDFs professionally. Fast, secure,
            and designed for productivity.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {features.map((feature: Feature, index: number) => (
            <div
              key={feature.name}
              className="group relative bg-[var(--brand-cream)] rounded-md p-8 border border-[var(--brand-storm)] cursor-pointer"
              onClick={() => handleFeatureClick(feature.route)}
            >
              <div className="flex gap-4 items-center mb-4">
                {/* Icon */}
                <div
                  className={`relative z-10 w-10 h-10 bg-[var(--brand-sky)] rounded-sm flex items-center justify-center`}
                >
                  <div className="text-[color:var(--brand-midnight)]">
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                {/* <div className="relative z-10"> */}
                <h3 className="text-2xl font-semibold text-[color:var(--brand-midnight)]">
                  {feature.name}
                </h3>
              </div>
              <p className="text-[color:var(--brand-storm)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-[color:var(--brand-storm)] mb-6">
            Ready to streamline your workflow?
          </p>
          <button className="px-8 py-3 bg-[var(--brand-forest)] text-[var(--brand-cloud)] font-medium rounded-lg">
            Explore All Tools
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
