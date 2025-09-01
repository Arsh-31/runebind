import { Lock } from "lucide-react";

export default function ProtectPdfPage() {
  return (
    <div className="min-h-[73vh] flex items-center bg-gray-50 transition-colors">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl rounded-2xl border border-blue-200 bg-white p-8 shadow-lg transition-colors">
          <div className="text-center">
            <div className="mb-6 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Lock size={28} />
              </div>
            </div>
            <h2 className="mb-3 text-2xl font-semibold text-gray-800">
              Protect PDF Feature
            </h2>
            <p className="leading-relaxed text-gray-600">
              This feature is coming soon! You’ll be able to add passwords and
              encryption to secure your sensitive PDF files.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
