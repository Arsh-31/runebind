"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Download, RotateCcw } from "lucide-react";

export default function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [mergedPdfBlob, setMergedPdfBlob] = useState<Blob | null>(null);
  const [isMerged, setIsMerged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_FILES = 10;

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

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);
    const validFiles = newFiles.filter(validateFile);

    if (files.length + validFiles.length > MAX_FILES) {
      showMessage(`Maximum ${MAX_FILES} files allowed`, "error");
      return;
    }

    setFiles((prev) => [...prev, ...validFiles]);
    showMessage(`${validFiles.length} file(s) added`, "success");
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      showMessage("Please select at least 2 PDF files to merge", "error");
      return;
    }

    setIsUploading(true);
    showMessage("Merging PDFs...", "info");

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/merge-pdf", {
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
      setMergedPdfBlob(blob);
      setIsMerged(true);
      showMessage(
        "PDFs merged successfully! Click Download to save the file.",
        "success"
      );
    } catch (error) {
      console.error("Merge error:", error);
      showMessage(
        error instanceof Error
          ? error.message
          : "Failed to merge PDFs. Please try again.",
        "error"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const downloadPDF = () => {
    if (!mergedPdfBlob) return;

    const url = window.URL.createObjectURL(mergedPdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "merged-document.pdf";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const startOver = () => {
    setFiles([]);
    setMergedPdfBlob(null);
    setIsMerged(false);
    setMessage("");
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
            Merge PDF Files
          </h1>
          <p className="text-lg text-gray-600">
            Combine multiple PDF files into a single document
          </p>
        </div>

        <div className="card">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              files.length === 0
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
                  Drop PDF files here or click to browse
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Select multiple PDF files to merge (max {MAX_FILES} files,
                  50MB each)
                </p>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Selected Files ({files.length})
              </h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({formatFileSize(file.size)})
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ))}
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

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={isMerged ? downloadPDF : mergePDFs}
              disabled={files.length < 2 || isUploading}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                files.length < 2 || isUploading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isMerged
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Merging...</span>
                </div>
              ) : isMerged ? (
                <div className="flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Download Merged PDF</span>
                </div>
              ) : (
                `Merge ${files.length} PDF${files.length !== 1 ? "s" : ""}`
              )}
            </button>

            {isMerged && (
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
            How to merge PDFs:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Drag and drop PDF files or click to browse and select files</li>
            <li>Select at least 2 PDF files to merge</li>
            <li>Click the &quot;Merge PDFs&quot; button</li>
            <li>Download your merged PDF file</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
