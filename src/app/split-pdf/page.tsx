"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Download, RotateCcw } from "lucide-react";

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [splitPdfBlob, setSplitPdfBlob] = useState<Blob | null>(null);
  const [isSplit, setIsSplit] = useState(false);
  const [pageRanges, setPageRanges] = useState("");
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const showMessage = (text: string, type: "success" | "error" | "info") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  const validateFile = (file: File): boolean => {
    if (file.type !== "application/pdf") {
      showMessage("Only PDF files are allowed", "error");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      showMessage(
        `File size must be less than 50MB. ${file.name} is ${(
          file.size /
          1024 /
          1024
        ).toFixed(1)}MB`,
        "error"
      );
      return false;
    }
    return true;
  };

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return;

    if (!validateFile(selectedFile)) return;

    setFile(selectedFile);
    showMessage("File uploaded successfully", "success");
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
      showMessage("Please upload a PDF file", "error");
      return;
    }

    if (!pageRanges.trim()) {
      showMessage("Please specify which pages to extract", "error");
      return;
    }

    setIsUploading(true);
    showMessage("Splitting PDF...", "info");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pages", pageRanges);

      const response = await fetch("/api/split-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const blob = await response.blob();
      setSplitPdfBlob(blob);
      setIsSplit(true);
      showMessage(
        "PDF split successfully! Click Download to save the file.",
        "success"
      );
    } catch (error) {
      console.error("Split error:", error);
      showMessage(
        error instanceof Error
          ? error.message
          : "Failed to split PDF. Please try again.",
        "error"
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
    a.download = "split-document.pdf";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Split PDF Files
          </h1>
          <p className="text-lg text-gray-600">
            Upload a PDF file and extract specific pages
          </p>
        </div>

        <div className="card">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              !file
                ? "border-blue-300 bg-blue-50 hover:bg-blue-100"
                : "border-gray-300 bg-gray-50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Drop a PDF file here or click to browse
                </p>
                <p className="text-sm text-gray-600 mt-2">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Selected File
              </h3>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({formatFileSize(file.size)})
                    </span>
                    {totalPages && (
                      <span className="text-xs text-gray-500 ml-2">
                        ~{totalPages} pages
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={startOver}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          )}

          {/* Page Range Input */}
          {file && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
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
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Quick Selection Buttons */}
                {totalPages && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Quick selection:</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => addPageRange("1")}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        First page
                      </button>
                      <button
                        onClick={() => addPageRange(`${totalPages}`)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        Last page
                      </button>
                      <button
                        onClick={() => addPageRange(`1-${totalPages}`)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        All pages
                      </button>
                      <button
                        onClick={() =>
                          addPageRange(`1-${Math.floor(totalPages / 2)}`)
                        }
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        First half
                      </button>
                      <button
                        onClick={() =>
                          addPageRange(
                            `${Math.floor(totalPages / 2) + 1}-${totalPages}`
                          )
                        }
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
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
                messageType === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : messageType === "error"
                  ? "bg-red-50 border border-red-200 text-red-800"
                  : "bg-blue-50 border border-blue-200 text-blue-800"
              }`}
            >
              {message}
            </div>
          )}

          {/* Split/Download Button */}
          <div className="mt-6 space-y-3">
            <button
              onClick={isSplit ? downloadPDF : splitPDF}
              disabled={!file || !pageRanges.trim() || isUploading}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                !file || !pageRanges.trim() || isUploading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isSplit
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Splitting...</span>
                </div>
              ) : isSplit ? (
                <div className="flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Download Split PDF</span>
                </div>
              ) : (
                "Split PDF"
              )}
            </button>

            {isSplit && (
              <button
                onClick={startOver}
                className="w-full py-2 px-6 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                <div className="flex items-center justify-center space-x-2">
                  <RotateCcw className="w-4 h-4" />
                  <span>Start Over</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            How to split PDFs:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <ol className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </span>
                  <span>
                    Upload a PDF file by dragging and dropping or clicking to
                    browse
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </span>
                  <span>
                    Enter the page ranges you want to extract (e.g.,
                    &quot;1,3,5-7,10&quot;)
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </span>
                  <span>
                    Use the quick selection buttons for common page ranges
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </span>
                  <span>Click the &quot;Split PDF&quot; button</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    5
                  </span>
                  <span>Download your extracted PDF file</span>
                </li>
              </ol>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                Page Range Examples:
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div>
                    <span className="font-medium text-gray-900">
                      <code>1,3,5</code>
                    </span>
                    <span className="text-sm text-gray-600">
                      {" "}
                      - Extract pages 1, 3, and 5
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div>
                    <span className="font-medium text-gray-900">
                      <code>1-5</code>
                    </span>
                    <span className="text-sm text-gray-600">
                      {" "}
                      - Extract pages 1 through 5
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div>
                    <span className="font-medium text-gray-900">
                      <code>1,3,5-7,10</code>
                    </span>
                    <span className="text-sm text-gray-600">
                      {" "}
                      - Extract pages 1, 3, 5-7, and 10
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div>
                    <span className="font-medium text-gray-900">
                      <code>1-3,7-9</code>
                    </span>
                    <span className="text-sm text-gray-600">
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
