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
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
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
    // In a real implementation, this would download the actual JPG images
    // For now, we'll show a demo message
    alert(
      "In a production environment, this would download the converted JPG images as a ZIP file."
    );
  };

  const handleButtonClick = () => {
    if (isConverted) {
      downloadImages();
    } else {
      convertToJpg();
    }
  };

  const startOver = () => {
    setFile(null);
    setConversionResult(null);
    setIsConverted(false);
    setMessage("");
    setPages("all");
    setQuality(80);
    setTotalPages(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addPageRange = (range: string) => {
    if (pages === "all") {
      setPages(range);
    } else {
      setPages((prev) => `${prev}, ${range}`);
    }
  };

  return (
    <div className="p-8 bg-[var(--brand-cloud)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-[var(--brand-midnight)] mb-4">
            PDF to JPG Converter
          </h1>
          <p className="text-[var(--brand-storm)] text-lg">
            Convert PDF pages to high-quality JPG images
          </p>
        </div>

        <div className="bg-[var(--brand-cream)] rounded-xl p-8 border border-[var(--brand-storm)]">
          {/* File Upload Area */}
          <div
            className="border-2 border-dashed border-[var(--brand-storm)] rounded-lg p-8 text-center hover:bg-[var(--brand-cloud)]/60 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-[var(--brand-sky)] rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[var(--brand-midnight)]"
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
                <p className="text-lg font-medium text-[var(--brand-midnight)]">
                  Drop a PDF file here or click to browse
                </p>
                <p className="text-sm text-[var(--brand-storm)] mt-2">
                  Select a PDF file to convert to JPG images (max 50MB)
                </p>
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
            <div className="mt-6">
              <h3 className="text-lg font-medium text-[var(--brand-midnight)] mb-4">
                Selected File
              </h3>
              <div className="flex items-center justify-between bg-[var(--brand-cloud)] rounded-lg p-3 border border-[var(--brand-storm)]">
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-[var(--brand-midnight)]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium text-[var(--brand-midnight)]">
                    {file.name}
                  </span>
                  <span className="text-xs text-[var(--brand-storm)]">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  onClick={startOver}
                  className="text-[var(--brand-midnight)] hover:opacity-80 transition-opacity"
                >
                  <svg
                    className="w-5 h-5"
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
            <div className="mt-6 space-y-6">
              {/* Page Selection */}
              <div>
                <h3 className="text-lg font-medium text-[var(--brand-midnight)] mb-4">
                  Select Pages to Convert
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--brand-midnight)] mb-2">
                      Page Ranges (e.g., 1,3,5-7,10) or "all" for all pages
                    </label>
                    <input
                      type="text"
                      value={pages}
                      onChange={(e) => setPages(e.target.value)}
                      placeholder="Enter page ranges..."
                      className="w-full px-3 py-2 border border-[var(--brand-storm)] rounded-lg focus:outline-none"
                    />
                  </div>

                  {/* Quick Selection Buttons */}
                  <div className="space-y-2">
                    <p className="text-sm text-[var(--brand-storm)]">
                      Quick selection:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setPages("all")}
                        className="px-3 py-1 text-xs bg-[var(--brand-sky)] text-[var(--brand-midnight)] rounded"
                      >
                        All pages
                      </button>
                      <button
                        onClick={() => addPageRange("1")}
                        className="px-3 py-1 text-xs bg-[var(--brand-sky)] text-[var(--brand-midnight)] rounded"
                      >
                        First page
                      </button>
                      <button
                        onClick={() => addPageRange("1-3")}
                        className="px-3 py-1 text-xs bg-[var(--brand-sky)] text-[var(--brand-midnight)] rounded"
                      >
                        First 3 pages
                      </button>
                      <button
                        onClick={() => addPageRange("1,3,5")}
                        className="px-3 py-1 text-xs bg-[var(--brand-sky)] text-[var(--brand-midnight)] rounded"
                      >
                        Odd pages
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quality Selection */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  JPG Quality
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Quality: {quality}%
                    </span>
                    <span className="text-xs text-gray-500">
                      {quality < 50 ? "Low" : quality < 80 ? "Medium" : "High"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>10%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Conversion Results */}
          {isConverted && conversionResult && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-medium text-green-800 mb-2">
                Conversion Results
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[color:var(--brand-storm)]">
                    Total pages:
                  </span>
                  <span className="ml-2 font-medium">
                    {conversionResult.totalPages}
                  </span>
                </div>
                <div>
                  <span className="text-[color:var(--brand-storm)]">
                    Converted pages:
                  </span>
                  <span className="ml-2 font-medium">
                    {conversionResult.convertedPages}
                  </span>
                </div>
                <div>
                  <span className="text-[color:var(--brand-storm)]">
                    Quality:
                  </span>
                  <span className="ml-2 font-medium">
                    {conversionResult.quality}%
                  </span>
                </div>
                <div>
                  <span className="text-[color:var(--brand-storm)]">
                    Pages:
                  </span>
                  <span className="ml-2 font-medium">
                    {conversionResult.pages.join(", ")}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Note: {conversionResult.note}
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div
              className={`mt-4 p-3 rounded-lg ${
                message.includes("successfully")
                  ? "bg-[var(--brand-cloud)] text-[var(--brand-midnight)] border border-[var(--brand-storm)]"
                  : "bg-[var(--brand-cloud)] text-[var(--brand-midnight)] border border-[var(--brand-storm)]"
              }`}
            >
              {message}
            </div>
          )}

          {/* Convert/Download Button */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleButtonClick}
              disabled={!file || isUploading}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                !file || isUploading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[var(--brand-forest)] text-[var(--brand-cloud)]"
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Converting...</span>
                </div>
              ) : isConverted ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Download JPG Images</span>
                </div>
              ) : (
                "Convert to JPG"
              )}
            </button>

            {isConverted && (
              <button
                onClick={startOver}
                className="w-full py-2 px-6 rounded-lg font-medium bg-[var(--brand-cloud)] text-[var(--brand-midnight)] border border-[var(--brand-storm)]"
              >
                Start Over
              </button>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-[var(--brand-cream)] rounded-2xl p-8 border border-[color:var(--brand-storm)]/25">
          <h3 className="text-2xl font-semibold text-[color:var(--brand-midnight)] mb-6">
            How to use:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <ol className="space-y-3 text-[color:var(--brand-storm)]">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[var(--brand-sky)] text-[color:var(--brand-midnight)] rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </span>
                  <span>
                    Upload a PDF file by dragging and dropping or clicking to
                    browse
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[var(--brand-sky)] text-[color:var(--brand-midnight)] rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </span>
                  <span>
                    Select which pages to convert (all pages or specific ranges)
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[var(--brand-sky)] text-[color:var(--brand-midnight)] rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </span>
                  <span>Adjust the JPG quality setting</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[var(--brand-sky)] text-[color:var(--brand-midnight)] rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </span>
                  <span>Click the "Convert to JPG" button</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[var(--brand-sky)] text-[color:var(--brand-midnight)] rounded-full flex items-center justify-center text-sm font-medium">
                    5
                  </span>
                  <span>Download your JPG images</span>
                </li>
              </ol>
            </div>

            <div className="bg-[var(--brand-cloud)] rounded-xl p-6 border border-[color:var(--brand-storm)]/25">
              <h4 className="font-semibold text-[color:var(--brand-midnight)] mb-4 text-lg">
                Page Range Examples:
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-[var(--brand-storm)] rounded-full"></div>
                  <div>
                    <span className="font-medium text-[color:var(--brand-midnight)]">
                      <code>all</code>
                    </span>
                    <span className="text-[color:var(--brand-storm)] text-sm">
                      {" "}
                      - Convert all pages
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-[var(--brand-storm)] rounded-full"></div>
                  <div>
                    <span className="font-medium text-[color:var(--brand-midnight)]">
                      <code>1,3,5</code>
                    </span>
                    <span className="text-[color:var(--brand-storm)] text-sm">
                      {" "}
                      - Convert pages 1, 3, and 5
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-[var(--brand-storm)] rounded-full"></div>
                  <div>
                    <span className="font-medium text-[color:var(--brand-midnight)]">
                      <code>1-5</code>
                    </span>
                    <span className="text-[color:var(--brand-storm)] text-sm">
                      {" "}
                      - Convert pages 1 through 5
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-[var(--brand-storm)] rounded-full"></div>
                  <div>
                    <span className="font-medium text-[color:var(--brand-midnight)]">
                      <code>1,3,5-7,10</code>
                    </span>
                    <span className="text-[color:var(--brand-storm)] text-sm">
                      {" "}
                      - Convert pages 1, 3, 5-7, and 10
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
