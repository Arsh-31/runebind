"use client";
import React from "react";
import { useRouter } from "next/navigation";

// Define the interface for a Feature object
interface Feature {
  name: string;
  description: string;
  icon: string; // Or React.ReactNode if you pass actual icon components
  route: string; // Route to navigate to
}

// Define props for IconPlaceholder (if it were to receive props)
interface IconPlaceholderProps {
  children: React.ReactNode;
}

const IconPlaceholder: React.FC<IconPlaceholderProps> = ({ children }) => (
  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
    {children}
  </div>
);

const features: Feature[] = [
  // Explicitly type the features array
  {
    name: "Merge PDFs",
    description: "Combine multiple PDF documents into a single, cohesive file.",
    icon: "🔗", // Replace with an actual icon
    route: "/merge-pdf",
  },
  {
    name: "Split PDFs",
    description: "Extract specific pages or ranges from your PDFs with ease.",
    icon: "✂️", // Replace with an actual icon
    route: "/split-pdf",
  },
  {
    name: "Convert to PDF",
    description: "Transform various file formats into professional PDFs.",
    icon: "🔄", // Replace with an actual icon
    route: "/pdf-to-jpg",
  },
  {
    name: "Edit PDFs",
    description: "Make quick edits to text, images, and pages directly.",
    icon: "✏️", // Replace with an actual icon
    route: "/edit-pdf",
  },
  {
    name: "Compress PDFs",
    description: "Reduce file size without compromising document quality.",
    icon: "🔽", // Replace with an actual icon
    route: "/compress-pdf",
  },
  {
    name: "Protect PDFs",
    description: "Add passwords and encryption to secure your sensitive files.",
    icon: "🔒", // Replace with an actual icon
    route: "/protect-pdf",
  },
];

const FeatureGrid: React.FC = () => {
  const router = useRouter();

  const handleFeatureClick = (route: string) => {
    router.push(route);
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Powerful Tools at Your Fingertips
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(
            (
              feature: Feature // Explicitly type 'feature' in map
            ) => (
              <div
                key={feature.name}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 ease-in-out hover:shadow-lg cursor-pointer"
                onClick={() => handleFeatureClick(feature.route)}
              >
                <IconPlaceholder>{feature.icon}</IconPlaceholder>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {feature.name}
                </h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
