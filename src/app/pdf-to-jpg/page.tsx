import PdfToJpg from "@/components/PdfToJpg";

export default function PdfToJpgPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-900">
          Convert PDF to JPG
        </h1>
        <PdfToJpg />
      </div>
    </div>
  );
}
