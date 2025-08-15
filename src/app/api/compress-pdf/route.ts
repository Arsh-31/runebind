import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const quality = formData.get('quality') as string || 'medium';
    
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
    
    // Set compression options based on quality
    const compressionOptions = getCompressionOptions(quality);
    
    // Save the compressed PDF
    const compressedPdfBytes = await pdf.save(compressionOptions);

    // Return the compressed PDF as a response
    return new NextResponse(compressedPdfBytes as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="compressed.pdf"',
        'Content-Length': compressedPdfBytes.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error compressing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to compress PDF file' },
      { status: 500 }
    );
  }
}

// Handle GET request to show API info
export async function GET() {
  return NextResponse.json({
    message: 'PDF Compress API',
    description: 'Upload a PDF file to reduce its size',
    method: 'POST',
    accepts: 'multipart/form-data',
    parameters: {
      file: 'PDF file to compress',
      quality: 'Compression quality (low, medium, high)'
    },
    maxFileSize: '50MB',
    fileType: 'application/pdf',
  });
}

// Helper function to get compression options
function getCompressionOptions(quality: string) {
  switch (quality) {
    case 'low':
      return {
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 20,
        updateFieldAppearances: false,
        throwOnInvalidObject: false,
      };
    case 'high':
      return {
        useObjectStreams: false,
        addDefaultPage: false,
        objectsPerTick: 50,
        updateFieldAppearances: false,
        throwOnInvalidObject: false,
      };
    case 'medium':
    default:
      return {
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 30,
        updateFieldAppearances: false,
        throwOnInvalidObject: false,
      };
  }
}