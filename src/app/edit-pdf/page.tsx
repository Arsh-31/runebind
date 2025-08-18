import { Edit } from "lucide-react";

export default function EditPdfPage() {
  return (
    <div className="min-h-[73vh] bg-gray-50">
      <div className="container mx-auto px-4 py-18">
        <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center">
            <div className="mb-4 text-6xl flex items-center justify-center">
              <Edit size={28} />
            </div>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Edit PDF Feature
            </h2>
            <p className="text-gray-600">
              This feature is coming soon! You'll be able to edit text, images,
              and pages directly in your PDF files.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
