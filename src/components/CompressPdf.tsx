'use client';

import { useState, useRef } from 'react';

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [compressedPdfBlob, setCompressedPdfBlob] = useState<Blob | null>(null);
  const [isCompressed, setIsCompressed] = useState(false);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return;
    
    if (selectedFile.type !== 'application/pdf') {
      setMessage('Only PDF files are allowed');
      return;
    }
    
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    setMessage('');
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
      setMessage('Please upload a PDF file');
      return;
    }

    setIsUploading(true);
    setMessage('Compressing PDF...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('quality', quality);

      const response = await fetch('/api/compress-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to compress PDF');
      }

      // Store the compressed PDF blob
      const blob = await response.blob();
      setCompressedPdfBlob(blob);
      setCompressedSize(blob.size);
      setIsCompressed(true);
      
      const compressionRatio = originalSize ? ((originalSize - blob.size) / originalSize * 100).toFixed(1) : '0';
      setMessage(`PDF compressed successfully! Size reduced by ${compressionRatio}%. Click Download to save the file.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to compress PDF');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadPDF = () => {
    if (!compressedPdfBlob) return;
    
    const url = window.URL.createObjectURL(compressedPdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed.pdf';
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
    setMessage('');
    setOriginalSize(null);
    setCompressedSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            PDF Compressor
          </h1>
          <p className="text-gray-600 text-lg">
            Upload a PDF file to reduce its size
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* File Upload Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700">
                  Drop a PDF file here or click to browse
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Select a PDF file to compress (max 50MB)
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
                  <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({formatFileSize(file.size)})
                  </span>
                </div>
                <button
                  onClick={startOver}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Compression Quality Selection */}
          {file && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Compression Quality
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setQuality('low')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    quality === 'low'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-medium">Low</div>
                    <div className="text-sm text-gray-500">Maximum compression</div>
                    <div className="text-xs text-gray-400">Smallest file size</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setQuality('medium')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    quality === 'medium'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-medium">Medium</div>
                    <div className="text-sm text-gray-500">Balanced compression</div>
                    <div className="text-xs text-gray-400">Good quality & size</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setQuality('high')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    quality === 'high'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-medium">High</div>
                    <div className="text-sm text-gray-500">Minimum compression</div>
                    <div className="text-xs text-gray-400">Best quality</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Compression Results */}
          {isCompressed && originalSize && compressedSize && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-medium text-green-800 mb-2">
                Compression Results
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Original size:</span>
                  <span className="ml-2 font-medium">{formatFileSize(originalSize)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Compressed size:</span>
                  <span className="ml-2 font-medium text-green-600">{formatFileSize(compressedSize)}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Size reduction:</span>
                  <span className="ml-2 font-medium text-green-600">
                    {((originalSize - compressedSize) / originalSize * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg ${
              message.includes('successfully') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          {/* Compress/Download Button */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleButtonClick}
              disabled={!file || isUploading}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                !file || isUploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isCompressed
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Compressing...</span>
                </div>
              ) : isCompressed ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download Compressed PDF</span>
                </div>
              ) : (
                'Compress PDF'
              )}
            </button>
            
            {isCompressed && (
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
          <h3 className="text-lg font-medium text-gray-700 mb-4">How to use:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Upload a PDF file by dragging and dropping or clicking to browse</li>
            <li>Select the compression quality (Low, Medium, or High)</li>
            <li>Click the "Compress PDF" button</li>
            <li>Download your compressed PDF file</li>
          </ol>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Compression Quality Guide:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li><strong>Low:</strong> Maximum compression, smallest file size</li>
              <li><strong>Medium:</strong> Balanced compression, good quality and size</li>
              <li><strong>High:</strong> Minimum compression, best quality</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}