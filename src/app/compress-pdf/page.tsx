"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Download, RotateCcw } from "lucide-react";

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [compressedPdfBlob, setCompressedPdfBlob] = useState<Blob | null>(null);
  const [isCompressed, setIsCompressed] = useState(false);
  const [quality, setQuality] = useState<"low" | "medium" | "high">("medium");
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
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
    setOriginalSize(selectedFile.size);
    setCompressedPdfBlob(null);
    setCompressedSize(null);
    setIsCompressed(false);
    showMessage("File added successfully", "success");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) handleFileSelect(selectedFile);
  };

  const compressPDF = async () => {
    if (!file) {
      showMessage("Please upload a PDF file", "error");
      return;
    }

    setIsUploading(true);
    showMessage("Compressing PDF...", "info");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("quality", quality);

      const response = await fetch("/api/compress-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          error.error || `HTTP error! status: ${response.status}`
        );
      }

      const blob = await response.blob();
      setCompressedPdfBlob(blob);
      setCompressedSize(blob.size);
      setIsCompressed(true);

      const compressionRatio = originalSize
        ? (((originalSize - blob.size) / originalSize) * 100).toFixed(1)
        : "0";

      showMessage(`PDF compressed! Reduced by ${compressionRatio}%`, "success");
    } catch (error) {
      console.error("Compression error:", error);
      showMessage(
        error instanceof Error
          ? error.message
          : "Failed to compress PDF. Please try again.",
        "error"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const downloadPDF = () => {
    if (!compressedPdfBlob) return;
    const url = window.URL.createObjectURL(compressedPdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "compressed.pdf";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const startOver = () => {
    setFile(null);
    setCompressedPdfBlob(null);
    setIsCompressed(false);
    setOriginalSize(null);
    setCompressedSize(null);
    setMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number) => {
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
            Compress PDF File
          </h1>
          <p className="text-lg text-gray-600">
            Reduce the size of your PDF without losing much quality
          </p>
        </div>

        <div className="card">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              !file
                ? "border-blue-300 bg-blue-50 hover:bg-blue-100"
                : "border-gray-300 bg-gray-50"
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
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
                <p className="text-sm text-gray-600 mt-2">Max file size 50MB</p>
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

          {/* Quality Options */}
          {file && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Compression Quality
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {["low", "medium", "high"].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q as "low" | "medium" | "high")}
                    className={`p-4 rounded-lg border text-center transition-colors ${
                      quality === q
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    <div className="font-medium text-black capitalize">{q}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {q === "low"
                        ? "Max compression"
                        : q === "medium"
                        ? "Balanced"
                        : "Best quality"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Compression Results */}
          {isCompressed && originalSize && compressedSize && (
            <div className="mt-6 p-4 rounded-lg border bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Results
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded border bg-white">
                  <div className="text-lg text-gray-900 font-medium">
                    {formatFileSize(originalSize)}
                  </div>
                  <div className="text-xs text-gray-600">Original size</div>
                </div>
                <div className="p-3 rounded border bg-white">
                  <div className="text-lg text-gray-900 font-medium">
                    {formatFileSize(compressedSize)}
                  </div>
                  <div className="text-xs text-gray-600">Compressed size</div>
                </div>
                <div className="p-3 rounded border bg-white">
                  <div className="text-lg text-gray-900 font-medium">
                    {(
                      ((originalSize - compressedSize) / originalSize) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                  <div className="text-xs text-gray-600">Size reduction</div>
                </div>
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
              onClick={isCompressed ? downloadPDF : compressPDF}
              disabled={!file || isUploading}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                !file || isUploading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isCompressed
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Compressing...</span>
                </div>
              ) : isCompressed ? (
                <div className="flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Download Compressed PDF</span>
                </div>
              ) : (
                "Compress PDF"
              )}
            </button>

            {isCompressed && (
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
            How to compress PDFs:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Upload a PDF file (max 50MB)</li>
            <li>Choose compression quality (Low, Medium, High)</li>
            <li>Click &quot;Compress PDF&quot; button</li>
            <li>Download your compressed PDF file</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
