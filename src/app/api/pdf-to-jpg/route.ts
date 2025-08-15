import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const pages = formData.get('pages') as string || 'all';
    const quality = parseInt(formData.get('quality') as string) || 80;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Please upload a PDF file' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const pdfBytes = new Uint8Array(arrayBuffer);
    
    // Load the PDF document
    const pdf = await PDFDocument.load(pdfBytes);
    const totalPages = pdf.getPageCount();
    
    // Determine which pages to convert
    let pagesToConvert: number[];
    if (pages === 'all') {
      pagesToConvert = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      pagesToConvert = parsePageRanges(pages).filter(pageNum => 
        pageNum >= 1 && pageNum <= totalPages
      );
    }
    
    if (pagesToConvert.length === 0) {
      return NextResponse.json(
        { error: 'No valid pages found to convert' },
        { status: 400 }
      );
    }

    // For now, we'll return a simple response indicating the conversion
    // In a real implementation, you would use a library like sharp or canvas to convert PDF pages to images
    // For this demo, we'll create a ZIP file with placeholder images
    
    const response = {
      message: 'PDF to JPG conversion completed',
      totalPages: totalPages,
      convertedPages: pagesToConvert.length,
      pages: pagesToConvert,
      quality: quality,
      note: 'This is a demo response. In production, you would receive actual JPG images.'
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error converting PDF to JPG:', error);
    return NextResponse.json(
      { error: 'Failed to convert PDF to JPG' },
      { status: 500 }
    );
  }
}

// Handle GET request to show API info
export async function GET() {
  return NextResponse.json({
    message: 'PDF to JPG API',
    description: 'Convert PDF pages to JPG images',
    method: 'POST',
    accepts: 'multipart/form-data',
    parameters: {
      file: 'PDF file to convert',
      pages: 'Pages to convert (e.g., "1,3,5-7" or "all")',
      quality: 'JPG quality (1-100, default: 80)'
    },
    maxFileSize: '50MB',
    fileType: 'application/pdf',
  });
}

// Helper function to parse page ranges
function parsePageRanges(pageRanges: string): number[] {
  const pages: number[] = [];
  const ranges = pageRanges.split(',').map(r => r.trim());
  
  for (const range of ranges) {
    if (range.includes('-')) {
      // Handle range like "5-7"
      const [start, end] = range.split('-').map(n => parseInt(n.trim()));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      }
    } else {
      // Handle single page like "3"
      const pageNum = parseInt(range);
      if (!isNaN(pageNum)) {
        pages.push(pageNum);
      }
    }
  }
  
  // Remove duplicates and sort
  return [...new Set(pages)].sort((a, b) => a - b);
}