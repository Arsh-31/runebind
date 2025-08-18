"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function Merge() {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [mergedPdfBlob, setMergedPdfBlob] = useState<Blob | null>(null);
  const [isMerged, setIsMerged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const pdfFiles = Array.from(selectedFiles).filter(
      (file) => file.type === "application/pdf"
    );

    if (pdfFiles.length !== selectedFiles.length) {
      setMessage("Only PDF files are allowed");
      return;
    }

    setFiles((prev) => [...prev, ...pdfFiles]);
    setMessage("");
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
      setMessage("Please select at least 2 PDF files to merge");
      return;
    }

    setIsUploading(true);
    setMessage("Merging PDFs...");

    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/merge-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to merge PDFs");
      }

      // Store the merged PDF blob
      const blob = await response.blob();
      setMergedPdfBlob(blob);
      setIsMerged(true);
      setMessage("PDFs merged successfully! Click Download to save the file.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to merge PDFs"
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
    a.download = "merged.pdf";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleButtonClick = () => {
    if (isMerged) {
      downloadPDF();
    } else {
      mergePDFs();
    }
  };

  const startOver = () => {
    setFiles([]);
    setMergedPdfBlob(null);
    setIsMerged(false);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[var(--brand-cloud)] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-[color:var(--brand-midnight)] mb-4">
            PDF Merger
          </h1>
          <p className="text-[color:var(--brand-storm)] text-lg">
            Upload multiple PDF files and merge them into a single document
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
                  className="w-8 h-8 text-[color:var(--brand-midnight)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-[color:var(--brand-midnight)]">
                  Drop PDF files here or click to browse
                </p>
                <p className="text-sm text-[color:var(--brand-storm)] mt-2">
                  Select multiple PDF files to merge (max 10 files, 50MB each)
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
              <h3 className="text-lg font-medium text-[color:var(--brand-midnight)] mb-4">
                Selected Files ({files.length})
              </h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[var(--brand-cloud)] rounded-lg p-3 border border-[var(--brand-storm)]"
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-[color:var(--brand-midnight)]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium text-[color:var(--brand-midnight)]">
                        {file.name}
                      </span>
                      <span className="text-xs text-[color:var(--brand-storm)]">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
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
                ))}
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

          {/* Merge/Download Button */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleButtonClick}
              disabled={files.length < 2 || isUploading}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                files.length < 2 || isUploading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[var(--brand-forest)] text-[var(--brand-cloud)]"
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Merging...</span>
                </div>
              ) : isMerged ? (
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
                  <span>Download Merged PDF</span>
                </div>
              ) : (
                `Merge ${files.length} PDF${files.length !== 1 ? "s" : ""}`
              )}
            </button>

            {isMerged && (
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
        <div className="mt-8 bg-[var(--brand-cream)] rounded-xl p-6 border border-[var(--brand-storm)]">
          <h3 className="text-lg font-medium text-[color:var(--brand-midnight)] mb-4">
            How to use:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Drag and drop PDF files or click to browse and select files</li>
            <li>Select at least 2 PDF files to merge</li>
            <li>Click the "Merge PDFs" button</li>
            <li>Download your merged PDF file</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
