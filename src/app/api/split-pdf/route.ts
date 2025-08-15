import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const pages = formData.get("pages") as string;

    if (!file) {
      return NextResponse.json(
        { error: "Please upload a PDF file" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    if (!pages) {
      return NextResponse.json(
        { error: "Please specify which pages to extract" },
        { status: 400 }
      );
    }

    // Parse the pages string (e.g., "1,3,5-7,10")
    const pageNumbers = parsePageRanges(pages);

    if (pageNumbers.length === 0) {
      return NextResponse.json(
        { error: "Invalid page range format" },
        { status: 400 }
      );
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const pdfBytes = new Uint8Array(arrayBuffer);

    // Load the PDF document
    const pdf = await PDFDocument.load(pdfBytes);
    const totalPages = pdf.getPageCount();

    // Validate page numbers
    const validPages = pageNumbers.filter(
      (pageNum) => pageNum >= 1 && pageNum <= totalPages
    );

    if (validPages.length === 0) {
      return NextResponse.json(
        { error: `No valid pages found. PDF has ${totalPages} pages.` },
        { status: 400 }
      );
    }

    if (validPages.length !== pageNumbers.length) {
      console.warn(
        `Some page numbers were invalid. Valid pages: ${validPages.join(", ")}`
      );
    }

    // Create a new PDF document for the extracted pages
    const newPdf = await PDFDocument.create();

    // Extract the specified pages
    for (const pageNum of validPages) {
      const [page] = await newPdf.copyPages(pdf, [pageNum - 1]); // pdf-lib uses 0-based indexing
      newPdf.addPage(page);
    }

    // Save the new PDF
    const newPdfBytes = await newPdf.save();

    // Return the split PDF as a response
    return new NextResponse(newPdfBytes as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="split.pdf"',
        "Content-Length": newPdfBytes.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error splitting PDF:", error);
    return NextResponse.json(
      { error: "Failed to split PDF file" },
      { status: 500 }
    );
  }
}

// Handle GET request to show API info
export async function GET() {
  return NextResponse.json({
    message: "PDF Split API",
    description: "Upload a PDF file and extract specific pages",
    method: "POST",
    accepts: "multipart/form-data",
    parameters: {
      file: "PDF file to split",
      pages: 'Page ranges (e.g., "1,3,5-7,10")',
    },
    maxFileSize: "50MB",
    fileType: "application/pdf",
  });
}

// Helper function to parse page ranges
function parsePageRanges(pageRanges: string): number[] {
  const pages: number[] = [];
  const ranges = pageRanges.split(",").map((r) => r.trim());

  for (const range of ranges) {
    if (range.includes("-")) {
      // Handle range like "5-7"
      const [start, end] = range.split("-").map((n) => parseInt(n.trim()));
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
