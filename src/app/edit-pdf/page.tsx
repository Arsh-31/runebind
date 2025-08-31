import { Edit } from "lucide-react";

export default function EditPdfPage() {
  return (
    <div className="min-h-[73vh] bg-[var(--background)] flex items-center">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl rounded-2xl bg-[var(--card)] p-8 shadow-lg">
          <div className="text-center">
            <div className="mb-6 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4f4f4f]">
                <Edit className="" size={28} />
              </div>
            </div>
            <h2 className="mb-3 text-2xl font-semibold ">Edit PDF Feature</h2>
            <p className=" leading-relaxed">
              This feature is coming soon! You’ll be able to edit text, images,
              and pages directly inside your PDF files.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
