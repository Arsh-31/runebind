"use client";

import { useState, useRef } from "react";

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [compressedPdfBlob, setCompressedPdfBlob] = useState<Blob | null>(null);
  const [isCompressed, setIsCompressed] = useState(false);
  const [quality, setQuality] = useState<"low" | "medium" | "high">("medium");
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setMessage("Only PDF files are allowed");
      return;
    }

    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    setMessage("");
    setIsCompressed(false);
    setCompressedPdfBlob(null);
    setCompressedSize(null);
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

  const compressPDF = async () => {
    if (!file) {
      setMessage("Please upload a PDF file");
      return;
    }

    setIsUploading(true);
    setMessage("Compressing PDF...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("quality", quality);

      const response = await fetch("/api/compress-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to compress PDF");
      }

      // Store the compressed PDF blob
      const blob = await response.blob();
      setCompressedPdfBlob(blob);
      setCompressedSize(blob.size);
      setIsCompressed(true);

      const compressionRatio = originalSize
        ? (((originalSize - blob.size) / originalSize) * 100).toFixed(1)
        : "0";
      setMessage(
        `PDF compressed successfully! Size reduced by ${compressionRatio}%. Click Download to save the file.`
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to compress PDF"
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

  const handleButtonClick = () => {
    if (isCompressed) {
      downloadPDF();
    } else {
      compressPDF();
    }
  };

  const startOver = () => {
    setFile(null);
    setCompressedPdfBlob(null);
    setIsCompressed(false);
    setMessage("");
    setOriginalSize(null);
    setCompressedSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold mb-4">PDF Compressor</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Reduce PDF file size without losing quality. Fast, secure, and
            completely free.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-[var(--card)] rounded-2xl p-8 md:p-12">
          {/* File Upload Area */}
          <div
            className="border-2 border-dashed border-[#4f4f4f] rounded-xl p-12 text-center hover:bg-[var(--brand-cloud)]/60 transition-colors cursor-pointer group"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-6">
              <div className="mx-auto w-20 h-20 bg-[var(--brand-sky)] rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xl font-medium  mb-2">
                  Drop a PDF file here or click to browse
                </p>
                <p className="">Select a PDF file to compress (max 50MB)</p>
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
                  <div className="p-2rounded-lg">
                    <svg
                      className="w-6 h-6 "
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="text-lg font-medium">{file.name}</span>
                    <div className="text-sm">{formatFileSize(file.size)}</div>
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

          {/* Compression Quality Selection */}
          {file && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-6">
                Compression Quality
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => setQuality("low")}
                  className={`p-6 rounded-xl border-1 transition-colors ${
                    quality === "low" ? "border-[#ffffff]" : "border-[#4f4f4f]"
                  }`}
                >
                  <div className="text-center">
                    <div className="font-medium text-lg mb-2">Low</div>
                    <div className="text-[#fff] mb-1">Maximum compression</div>
                    <div className="text-sm text-[#ffffff]/80">
                      Smallest file size
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setQuality("medium")}
                  className={`p-6 rounded-xl border-1 transition-colors ${
                    quality === "medium"
                      ? "border-[#ffffff]"
                      : "border-[#4f4f4f]"
                  }`}
                >
                  <div className="text-center">
                    <div className="font-medium text-lg mb-2">Medium</div>
                    <div className="text-[#fff] mb-1">Balanced compression</div>
                    <div className="text-sm text-[#fff]/80">
                      Good quality & size
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setQuality("high")}
                  className={`p-6 rounded-xl border-1 transition-colors ${
                    quality === "high" ? "border-[#ffffff]" : "border-[#4f4f4f]"
                  }`}
                >
                  <div className="text-center">
                    <div className="font-medium text-lg mb-2">High</div>
                    <div className="text-[#fff] mb-1">Minimum compression</div>
                    <div className="text-sm text-[#fff]/80">Best quality</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Compression Results */}
          {isCompressed && originalSize && compressedSize && (
            <div className="mt-8 p-6 rounded-xl border border-[#4f4f4f]/25">
              <h3 className="text-xl font-semibold mb-4">
                Compression Results
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-lg">
                <div className="text-center p-4 rounded-lg border border-[color:#fff]/25">
                  <div className="text-2xl font-medium">
                    {formatFileSize(originalSize)}
                  </div>
                  <div className="text-sm">Original size</div>
                </div>
                <div className="text-center p-4  rounded-lg border border-[color:#fff]/25">
                  <div className="text-2xl font-medium">
                    {formatFileSize(compressedSize)}
                  </div>
                  <div className="text-sm">Compressed size</div>
                </div>
                <div className="text-center p-4 rounded-lg border border-[color:#fff]/25">
                  <div className="text-2xl font-medium ">
                    {(
                      ((originalSize - compressedSize) / originalSize) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                  <div className="text-sm">Size reduction</div>
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-lg text-center border ${
                message.includes("successfully")
                  ? " border-[color:#4f4f4f]/25"
                  : "border-[color:#4f4f4f]/25"
              }`}
            >
              {message}
            </div>
          )}

          {/* Compress/Download Button */}
          <div className="mt-8 space-y-4">
            <button
              onClick={handleButtonClick}
              disabled={!file || isUploading}
              className={`w-full py-4 px-8 rounded-lg font-medium text-lg transition-colors ${
                !file || isUploading
                  ? "bg-[#fff] text-gray-600 cursor-not-allowed"
                  : "bg-[#fff] text-[#4f4f4f]"
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"></div>
                  <span>Compressing...</span>
                </div>
              ) : isCompressed ? (
                <div className="flex items-center justify-center space-x-3">
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Download Compressed PDF</span>
                </div>
              ) : (
                "Compress PDF"
              )}
            </button>

            {isCompressed && (
              <button
                onClick={startOver}
                className="w-full py-3 px-8 rounded-lg font-medium border border-[color:#fff/25"
              >
                Start Over
              </button>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-[var(--card)] rounded-2xl p-8">
          <h3 className="text-2xl font-semibold mb-6">How to use:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <ol className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </span>
                  <span>
                    Upload a PDF file by dragging and dropping or clicking to
                    browse
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6  rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </span>
                  <span>
                    Select the compression quality (Low, Medium, or High)
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </span>
                  <span>Click the "Compress PDF" button</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </span>
                  <span>Download your compressed PDF file</span>
                </li>
              </ol>
            </div>

            <div className="bg-[#4f4f4f] rounded-xl p-6">
              <h4 className="font-semibold mb-4 text-lg">
                Compression Quality Guide:
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-[var(--brand-storm)] rounded-full"></div>
                  <div>
                    <span className="font-medium">Low:</span>
                    <span className=" text-sm">
                      {" "}
                      Maximum compression, smallest file size
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full"></div>
                  <div>
                    <span className="font-medium ">Medium:</span>
                    <span className=" text-sm">
                      {" "}
                      Balanced compression, good quality and size
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3  rounded-full"></div>
                  <div>
                    <span className="font-medium ">High:</span>
                    <span className="text-sm">
                      {" "}
                      Minimum compression, best quality
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
