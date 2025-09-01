"use client";

import React, { useRef, useState } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Download,
  RotateCcw,
} from "lucide-react";

export default function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [conversionResult, setConversionResult] = useState<any>(null);
  const [isConverted, setIsConverted] = useState(false);
  const [pages, setPages] = useState<string>("all");
  const [quality, setQuality] = useState<number>(80);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const msgTimeoutRef = useRef<number | null>(null);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const showMessage = (text: string, type: "success" | "error" | "info") => {
    setMessage(text);
    setMessageType(type);
    if (msgTimeoutRef.current) window.clearTimeout(msgTimeoutRef.current);
    msgTimeoutRef.current = window.setTimeout(
      () => setMessage(""),
      5000
    ) as unknown as number;
  };

  const validateFile = (f: File) => {
    if (f.type !== "application/pdf") {
      showMessage("Only PDF files are allowed.", "error");
      return false;
    }
    if (f.size > MAX_FILE_SIZE) {
      showMessage(
        `${f.name} is too large. Maximum allowed size is 50MB.`,
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
    showMessage("File uploaded successfully.", "success");
    setIsConverted(false);
    setConversionResult(null);
    setPages("all");
    setQuality(80);
    setTotalPages(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFileSelect(dropped);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const getPageCount = async (file: File): Promise<number> => {
    // lightweight heuristic: estimate pages from file size
    // (use pdf-lib or server-side parsing for precise count)
    const estimated = Math.max(1, Math.floor(file.size / 50000));
    return estimated;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected) {
      handleFileSelect(selected);
      const pages = await getPageCount(selected);
      setTotalPages(pages);
    }
  };

  const convertToJpg = async () => {
    if (!file) {
      showMessage("Please upload a PDF file first.", "error");
      return;
    }

    setIsUploading(true);
    showMessage("Converting PDF to JPG...", "info");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pages", pages);
      formData.append("quality", String(quality));

      const res = await fetch("/api/pdf-to-jpg", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        // try to extract error message
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `HTTP ${res.status}`);
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const data = await res.json();
        setConversionResult(data);
        if (data.totalPages) setTotalPages(data.totalPages);
      } else {
        // assume binary zip of images
        const blob = await res.blob();
        setConversionResult(blob);
      }

      setIsConverted(true);
      showMessage("Conversion finished. Click Download to save.", "success");
    } catch (err) {
      console.error(err);
      showMessage(
        err instanceof Error ? err.message : "Conversion failed.",
        "error"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const downloadImages = () => {
    if (!conversionResult) {
      showMessage("Nothing to download.", "error");
      return;
    }

    // if backend returned a blob (zip)
    if (conversionResult instanceof Blob) {
      const url = window.URL.createObjectURL(conversionResult);
      const a = document.createElement("a");
      a.href = url;
      a.download = "images.zip";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      showMessage("Download started.", "success");
      return;
    }

    // if backend returned JSON with images array or zipUrl
    if (conversionResult?.zipUrl) {
      window.open(conversionResult.zipUrl, "_blank");
      return;
    }

    if (Array.isArray(conversionResult?.images)) {
      // trigger download for each image (browser will handle save)
      conversionResult.images.forEach((imgUrl: string, idx: number) => {
        const a = document.createElement("a");
        a.href = imgUrl;
        a.download = `page-${idx + 1}.jpg`;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
      showMessage("Downloaded images.", "success");
      return;
    }

    showMessage("No downloadable files returned from server.", "error");
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

  const addPageRange = (range: string) => {
    if (pages && pages !== "all") setPages((p) => `${p},${range}`);
    else setPages(range);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF → JPG</h1>
          <p className="text-lg text-gray-600">
            Convert PDF pages into JPG images quickly.
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
                  Select a PDF file to convert (max 50MB)
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
                  <ImageIcon className="w-5 h-5 text-blue-600" />
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

          {/* Conversion Settings */}
          {file && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Pages to convert
                </h3>
                <input
                  type="text"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  placeholder="e.g. all or 1,3,5-7"
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  JPG Quality
                </h3>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg bg-blue-400 appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>10%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

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
                      onClick={() => addPageRange(String(totalPages))}
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
                  </div>
                </div>
              )}
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

          {/* Convert / Download */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleButtonClick}
              disabled={!file || isUploading}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                !file || isUploading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isConverted
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Converting...</span>
                </div>
              ) : isConverted ? (
                <div className="flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Download JPGs</span>
                </div>
              ) : (
                "Convert to JPG"
              )}
            </button>

            {isConverted && (
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
            How to convert
          </h3>
          <ol className="space-y-3 text-gray-600">
            <li>Upload a PDF by drag/drop or click</li>
            <li>Enter pages to convert (or leave "all")</li>
            <li>Adjust JPG quality if needed</li>
            <li>Click Convert and then Download</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
