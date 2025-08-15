"use client";

import { useState, useRef } from "react";

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [splitPdfBlob, setSplitPdfBlob] = useState<Blob | null>(null);
  const [isSplit, setIsSplit] = useState(false);
  const [pageRanges, setPageRanges] = useState("");
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
    setIsSplit(false);
    setSplitPdfBlob(null);
    setPageRanges("");
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

  const getPageCount = async (file: File): Promise<number> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfBytes = new Uint8Array(arrayBuffer);

    // We'll use a simple approach to get page count
    // In a real app, you might want to use pdf-lib on the frontend
    // For now, we'll estimate based on file size (rough approximation)
    const estimatedPages = Math.max(1, Math.floor(file.size / 50000)); // Rough estimate
    return estimatedPages;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      handleFileSelect(selectedFile);
      // Get estimated page count
      const pages = await getPageCount(selectedFile);
      setTotalPages(pages);
    }
  };

  const splitPDF = async () => {
    if (!file) {
      setMessage("Please upload a PDF file");
      return;
    }

    if (!pageRanges.trim()) {
      setMessage("Please specify which pages to extract");
      return;
    }

    setIsUploading(true);
    setMessage("Splitting PDF...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pages", pageRanges);

      const response = await fetch("/api/split-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to split PDF");
      }

      // Store the split PDF blob
      const blob = await response.blob();
      setSplitPdfBlob(blob);
      setIsSplit(true);
      setMessage("PDF split successfully! Click Download to save the file.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to split PDF"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const downloadPDF = () => {
    if (!splitPdfBlob) return;

    const url = window.URL.createObjectURL(splitPdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "split.pdf";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleButtonClick = () => {
    if (isSplit) {
      downloadPDF();
    } else {
      splitPDF();
    }
  };

  const startOver = () => {
    setFile(null);
    setSplitPdfBlob(null);
    setIsSplit(false);
    setMessage("");
    setPageRanges("");
    setTotalPages(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addPageRange = (range: string) => {
    if (pageRanges) {
      setPageRanges((prev) => `${prev}, ${range}`);
    } else {
      setPageRanges(range);
    }
  };

  return (
    <div className="p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            PDF Splitter
          </h1>
          <p className="text-gray-600 text-lg">
            Upload a PDF file and extract specific pages
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* File Upload Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700">
                  Drop a PDF file here or click to browse
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Select a PDF file to split (max 50MB)
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
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Selected File
              </h3>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                  {totalPages && (
                    <span className="text-xs text-blue-600">
                      ~{totalPages} pages
                    </span>
                  )}
                </div>
                <button
                  onClick={startOver}
                  className="text-red-500 hover:text-red-700 transition-colors"
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

          {/* Page Range Input */}
          {file && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Select Pages to Extract
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Ranges (e.g., 1,3,5-7,10)
                  </label>
                  <input
                    type="text"
                    value={pageRanges}
                    onChange={(e) => setPageRanges(e.target.value)}
                    placeholder="Enter page ranges..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Quick Selection Buttons */}
                {totalPages && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Quick selection:</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => addPageRange("1")}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        First page
                      </button>
                      <button
                        onClick={() => addPageRange(`${totalPages}`)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        Last page
                      </button>
                      <button
                        onClick={() => addPageRange(`1-${totalPages}`)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        All pages
                      </button>
                      <button
                        onClick={() =>
                          addPageRange(`1-${Math.floor(totalPages / 2)}`)
                        }
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        First half
                      </button>
                      <button
                        onClick={() =>
                          addPageRange(
                            `${Math.floor(totalPages / 2) + 1}-${totalPages}`
                          )
                        }
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        Second half
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div
              className={`mt-4 p-3 rounded-lg ${
                message.includes("successfully")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Split/Download Button */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleButtonClick}
              disabled={!file || !pageRanges.trim() || isUploading}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                !file || !pageRanges.trim() || isUploading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isSplit
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Splitting...</span>
                </div>
              ) : isSplit ? (
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
                  <span>Download Split PDF</span>
                </div>
              ) : (
                "Split PDF"
              )}
            </button>

            {isSplit && (
              <button
                onClick={startOver}
                className="w-full py-2 px-6 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Start Over
              </button>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            How to use:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>
              Upload a PDF file by dragging and dropping or clicking to browse
            </li>
            <li>
              Enter the page ranges you want to extract (e.g., "1,3,5-7,10")
            </li>
            <li>Use the quick selection buttons for common page ranges</li>
            <li>Click the "Split PDF" button</li>
            <li>Download your extracted PDF file</li>
          </ol>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">
              Page Range Examples:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                <code>1,3,5</code> - Extract pages 1, 3, and 5
              </li>
              <li>
                <code>1-5</code> - Extract pages 1 through 5
              </li>
              <li>
                <code>1,3,5-7,10</code> - Extract pages 1, 3, 5-7, and 10
              </li>
              <li>
                <code>1-3,7-9</code> - Extract pages 1-3 and 7-9
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
