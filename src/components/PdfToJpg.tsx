"use client";

import { useState, useRef } from "react";

export default function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [conversionResult, setConversionResult] = useState<any>(null);
  const [isConverted, setIsConverted] = useState(false);
  const [pages, setPages] = useState("all");
  const [quality, setQuality] = useState(80);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf") {
      setMessage("Only PDF files are allowed");
      return;
    }
    setFile(selectedFile);
    setMessage("");
    setIsConverted(false);
    setConversionResult(null);
    setPages("all");
    setQuality(80);
    setTotalPages(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) handleFileSelect(selectedFile);
  };

  const convertToJpg = async () => {
    if (!file) {
      setMessage("Please upload a PDF file");
      return;
    }

    setIsUploading(true);
    setMessage("Converting PDF to JPG...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pages", pages);
      formData.append("quality", quality.toString());

      const response = await fetch("/api/pdf-to-jpg", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to convert PDF to JPG");
      }

      const result = await response.json();
      setConversionResult(result);
      setTotalPages(result.totalPages);
      setIsConverted(true);
      setMessage("PDF converted successfully! This is a demo response.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to convert PDF to JPG"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const downloadImages = () => {
    alert("In production, this would download JPGs as a ZIP.");
  };

  const handleButtonClick = () => {
    if (isConverted) downloadImages();
    else convertToJpg();
  };

  const startOver = () => {
    setFile(null);
    setConversionResult(null);
    setIsConverted(false);
    setMessage("");
    setPages("all");
    setQuality(80);
    setTotalPages(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold mb-4">PDF to JPG Converter</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Convert PDF pages into high-quality JPG images.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[var(--card)] rounded-2xl p-8 md:p-12">
          {/* Upload Area */}
          <div
            className="border-2 border-dashed border-[#4f4f4f] rounded-xl p-12 text-center hover:bg-[var(--brand-cloud)]/60 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-6">
              <div className="mx-auto w-20 h-20 bg-[var(--brand-sky)] rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xl font-medium mb-2">
                  Drop a PDF file here or click to browse
                </p>
                <p>Select a PDF file to convert (max 50MB)</p>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Selected File */}
          {file && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Selected File</h3>
              <div className="flex items-center justify-between rounded-xl p-4 border border-[#4f4f4f]">
                <div className="flex items-center space-x-4">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <span className="text-lg font-medium">{file.name}</span>
                    <div className="text-sm">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
                <button onClick={startOver} className="p-2 rounded-lg">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Conversion Settings */}
          {file && (
            <div className="mt-8 space-y-6">
              {/* Page Ranges */}
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Select Pages to Convert
                </h3>
                <input
                  type="text"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  placeholder="e.g. 1,3,5-7 or 'all'"
                  className="w-full px-3 py-2 border border-[#4f4f4f] rounded-lg bg-transparent focus:outline-none"
                />
              </div>

              {/* Quality Slider */}
              <div>
                <h3 className="text-xl font-semibold mb-4">JPG Quality</h3>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>10%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className="mt-6 p-4 rounded-xl border border-[#4f4f4f]">
              {message}
            </div>
          )}

          {/* Convert / Download */}
          <div className="mt-8">
            <button
              onClick={handleButtonClick}
              disabled={!file || isUploading}
              className="w-full py-3 px-6 rounded-xl bg-white text-black font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {isUploading
                ? "Converting..."
                : isConverted
                ? "Download JPG Images"
                : "Convert to JPG"}
            </button>

            {isConverted && (
              <button
                onClick={startOver}
                className="mt-4 w-full py-2 px-6 rounded-xl border border-[#4f4f4f]"
              >
                Start Over
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
