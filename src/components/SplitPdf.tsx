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
    <div className="py-8 bg-[var(--background)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold  mb-4">PDF Splitter</h1>
          <p className="text-[color:var(--brand-storm)] text-lg">
            Upload a PDF file and extract specific pages
          </p>
        </div>

        <div className="bg-[var(--card)] rounded-xl p-8 ">
          {/* File Upload Area */}
          <div
            className="border-2 border-dashed border-[#4f4f4f] rounded-lg p-8 text-center transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16  rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8"
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
                <p className="text-lg font-medium ">
                  Drop a PDF file here or click to browse
                </p>
                <p className="text-sm ">
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
              <h3 className="text-lg font-medium  mb-4">Selected File</h3>
              <div className="flex items-center justify-between rounded-lg p-3 border border-[#4f4f4f]">
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 t"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium ">{file.name}</span>
                  <span className="text-xs ">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                  {totalPages && (
                    <span className="text-xs ">~{totalPages} pages</span>
                  )}
                </div>
                <button
                  onClick={startOver}
                  className=" hover:opacity-80 transition-opacity"
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
              <h3 className="text-lg font-medium  mb-4">
                Select Pages to Extract
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium  mb-2">
                    Page Ranges (e.g., 1,3,5-7,10)
                  </label>
                  <input
                    type="text"
                    value={pageRanges}
                    onChange={(e) => setPageRanges(e.target.value)}
                    placeholder="Enter page ranges..."
                    className="w-full px-3 py-2 border border-[#4f4f4f] rounded-lg focus:outline-none"
                  />
                </div>

                {/* Quick Selection Buttons */}
                {totalPages && (
                  <div className="space-y-2">
                    <p className="text-sm ">Quick selection:</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => addPageRange("1")}
                        className="px-3 py-1 text-xs bg-[#4f4f4f] rounded-lg"
                      >
                        First page
                      </button>
                      <button
                        onClick={() => addPageRange(`${totalPages}`)}
                        className="px-3 py-1 text-xs bg-[#4f4f4f] rounded-lg"
                      >
                        Last page
                      </button>
                      <button
                        onClick={() => addPageRange(`1-${totalPages}`)}
                        className="px-3 py-1 text-xs bg-[#4f4f4f] rounded-lg"
                      >
                        All pages
                      </button>
                      <button
                        onClick={() =>
                          addPageRange(`1-${Math.floor(totalPages / 2)}`)
                        }
                        className="px-3 py-1 text-xs bg-[#4f4f4f] rounded-lg"
                      >
                        First half
                      </button>
                      <button
                        onClick={() =>
                          addPageRange(
                            `${Math.floor(totalPages / 2) + 1}-${totalPages}`
                          )
                        }
                        className="px-3 py-1 text-xs bg-[#4f4f4f] rounded-lg"
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
                  ? " border-[color:#4f4f4f]"
                  : "border-[color:#4f4f4f]"
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
              className={`w-full py-3 px-6 rounded-xl font-medium transition-colors ${
                !file || !pageRanges.trim() || isUploading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#fff] text-[#4f4f4f]"
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
                className="w-full py-2 px-6 rounded-lg font-medium  border border-[#4f4f4f]"
              >
                Start Over
              </button>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-[var(--card)] rounded-2xl p-8 ">
          <h3 className="text-2xl font-semibold  mb-6">How to use:</h3>
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
                    Enter the page ranges you want to extract (e.g.,
                    "1,3,5-7,10")
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[var(--brand-sky)] text-[color:var(--brand-midnight)] rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </span>
                  <span>
                    Use the quick selection buttons for common page ranges
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[var(--brand-sky)] text-[color:var(--brand-midnight)] rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </span>
                  <span>Click the "Split PDF" button</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[var(--brand-sky)] text-[color:var(--brand-midnight)] rounded-full flex items-center justify-center text-sm font-medium">
                    5
                  </span>
                  <span>Download your extracted PDF file</span>
                </li>
              </ol>
            </div>

            <div className=" rounded-xl p-6 bg-[#4f4f4f]">
              <h4 className="font-semibold  mb-4 text-lg">
                Page Range Examples:
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-[#fff] rounded-full"></div>
                  <div>
                    <span className="font-medium ">
                      <code>1,3,5</code>
                    </span>
                    <span className=" text-sm">
                      {" "}
                      - Extract pages 1, 3, and 5
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-[#fff] rounded-full"></div>
                  <div>
                    <span className="font-medium ">
                      <code>1-5</code>
                    </span>
                    <span className=" text-sm">
                      {" "}
                      - Extract pages 1 through 5
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-[#fff] rounded-full"></div>
                  <div>
                    <span className="font-medium ">
                      <code>1,3,5-7,10</code>
                    </span>
                    <span className=" text-sm">
                      {" "}
                      - Extract pages 1, 3, 5-7, and 10
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-[#fff] rounded-full"></div>
                  <div>
                    <span className="font-medium ">
                      <code>1-3,7-9</code>
                    </span>
                    <span className=" text-sm">
                      {" "}
                      - Extract pages 1-3 and 7-9
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
