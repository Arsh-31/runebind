'use client';

import { useState, useRef } from 'react';

export default function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [conversionResult, setConversionResult] = useState<any>(null);
  const [isConverted, setIsConverted] = useState(false);
  const [pages, setPages] = useState('all');
  const [quality, setQuality] = useState(80);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return;
    
    if (selectedFile.type !== 'application/pdf') {
      setMessage('Only PDF files are allowed');
      return;
    }
    
    setFile(selectedFile);
    setMessage('');
    setIsConverted(false);
    setConversionResult(null);
    setPages('all');
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
      setMessage('Please upload a PDF file');
      return;
    }

    setIsUploading(true);
    setMessage('Converting PDF to JPG...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pages', pages);
      formData.append('quality', quality.toString());

      const response = await fetch('/api/pdf-to-jpg', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to convert PDF to JPG');
      }

      const result = await response.json();
      setConversionResult(result);
      setTotalPages(result.totalPages);
      setIsConverted(true);
      setMessage('PDF converted successfully! This is a demo response.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to convert PDF to JPG');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadImages = () => {
    // In a real implementation, this would download the actual JPG images
    // For now, we'll show a demo message
    alert('In a production environment, this would download the converted JPG images as a ZIP file.');
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
    setMessage('');
    setPages('all');
    setQuality(80);
    setTotalPages(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addPageRange = (range: string) => {
    if (pages === 'all') {
      setPages(range);
    } else {
      setPages(prev => `${prev}, ${range}`);
    }
  };

  return (
    <div className="p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            PDF to JPG Converter
          </h1>
          <p className="text-gray-600 text-lg">
            Convert PDF pages to high-quality JPG images
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* File Upload Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700">
                  Drop a PDF file here or click to browse
                </p>
                <p className="text-sm text-gray-500 mt-2">
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
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Selected File
              </h3>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
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

          {/* Conversion Settings */}
          {file && (
            <div className="mt-6 space-y-6">
              {/* Page Selection */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Select Pages to Convert
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Ranges (e.g., 1,3,5-7,10) or "all" for all pages
                    </label>
                    <input
                      type="text"
                      value={pages}
                      onChange={(e) => setPages(e.target.value)}
                      placeholder="Enter page ranges..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Quick Selection Buttons */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Quick selection:</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setPages('all')}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        All pages
                      </button>
                      <button
                        onClick={() => addPageRange('1')}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        First page
                      </button>
                      <button
                        onClick={() => addPageRange('1-3')}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        First 3 pages
                      </button>
                      <button
                        onClick={() => addPageRange('1,3,5')}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
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
                    <span className="text-sm text-gray-600">Quality: {quality}%</span>
                    <span className="text-xs text-gray-500">
                      {quality < 50 ? 'Low' : quality < 80 ? 'Medium' : 'High'}
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
                  <span className="text-gray-600">Total pages:</span>
                  <span className="ml-2 font-medium">{conversionResult.totalPages}</span>
                </div>
                <div>
                  <span className="text-gray-600">Converted pages:</span>
                  <span className="ml-2 font-medium text-green-600">{conversionResult.convertedPages}</span>
                </div>
                <div>
                  <span className="text-gray-600">Quality:</span>
                  <span className="ml-2 font-medium">{conversionResult.quality}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Pages:</span>
                  <span className="ml-2 font-medium">{conversionResult.pages.join(', ')}</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Note: {conversionResult.note}
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

          {/* Convert/Download Button */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleButtonClick}
              disabled={!file || isUploading}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                !file || isUploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isConverted
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Converting...</span>
                </div>
              ) : isConverted ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download JPG Images</span>
                </div>
              ) : (
                'Convert to JPG'
              )}
            </button>
            
            {isConverted && (
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
            <li>Select which pages to convert (all pages or specific ranges)</li>
            <li>Adjust the JPG quality setting</li>
            <li>Click the "Convert to JPG" button</li>
            <li>Download your JPG images</li>
          </ol>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Page Range Examples:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li><code>all</code> - Convert all pages</li>
              <li><code>1,3,5</code> - Convert pages 1, 3, and 5</li>
              <li><code>1-5</code> - Convert pages 1 through 5</li>
              <li><code>1,3,5-7,10</code> - Convert pages 1, 3, 5-7, and 10</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
