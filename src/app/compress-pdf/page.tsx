import CompressPdf from "@/components/CompressPdf";

export default function CompressPdfPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-900">
          Compress PDF Files
        </h1>
        <CompressPdf />
      </div>
    </div>
  );
}
