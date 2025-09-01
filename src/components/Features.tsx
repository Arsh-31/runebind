"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Merge,
  Split,
  FileImage,
  Edit,
  FileDown,
  Shield,
} from "lucide-react";

interface Feature {
  name: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

const features: Feature[] = [
  {
    name: "Merge PDFs",
    description: "Combine multiple PDF documents into a single file.",
    icon: <Merge size={24} />,
    route: "/merge-pdf",
  },
  {
    name: "Split PDFs",
    description: "Extract specific pages or ranges from your PDFs.",
    icon: <Split size={24} />,
    route: "/split-pdf",
  },
  {
    name: "Convert to JPG",
    description: "Transform PDF pages into high-quality images.",
    icon: <FileImage size={24} />,
    route: "/pdf-to-jpg",
  },
  {
    name: "Edit PDFs",
    description: "Make quick edits to text, images, and pages.",
    icon: <Edit size={24} />,
    route: "/edit-pdf",
  },
  {
    name: "Compress PDFs",
    description: "Reduce file size without losing quality.",
    icon: <FileDown size={24} />,
    route: "/compress-pdf",
  },
  {
    name: "Protect PDFs",
    description: "Add passwords and encryption to secure files.",
    icon: <Shield size={24} />,
    route: "/protect-pdf",
  },
];

const FeatureGrid: React.FC = () => {
  const router = useRouter();

  const handleFeatureClick = (route: string) => {
    router.push(route);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            All PDF Tools
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to work with PDFs professionally. Fast, secure, and designed for productivity.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature: Feature) => (
            <div
              key={feature.name}
              className="card cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleFeatureClick(feature.route)}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <div className="text-blue-600">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.name}
                </h3>
              </div>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
