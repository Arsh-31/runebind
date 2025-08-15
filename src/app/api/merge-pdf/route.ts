import formidable, { File } from "formidable";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

interface ParsedFields {
  textToAdd?: string | string[];
  xPosition?: string | string[];
  yPosition?: string | string[];
  fontSize?: string | string[];
  pageNumber?: string | string[];
}

interface ParsedFiles {
  pdfFile?: File | File[];
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse the form data
    const form = formidable({
      uploadDir: "./public/uploads",
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    // Ensure upload directory exists
    await fs.mkdir("./public/uploads", { recursive: true });

    const [fields, files] = (await form.parse(request as any)) as [
      ParsedFields,
      ParsedFiles
    ];

    // Extract form data with proper type handling
    const textToAdd = Array.isArray(fields.textToAdd)
      ? fields.textToAdd[0]
      : fields.textToAdd;
    const xPosition =
      parseInt(
        Array.isArray(fields.xPosition)
          ? fields.xPosition[0]
          : fields.xPosition || "50"
      ) || 50;
    const yPosition =
      parseInt(
        Array.isArray(fields.yPosition)
          ? fields.yPosition[0]
          : fields.yPosition || "100"
      ) || 100;
    const fontSize =
      parseInt(
        Array.isArray(fields.fontSize)
          ? fields.fontSize[0]
          : fields.fontSize || "12"
      ) || 12;
    const pageNumber =
      parseInt(
        Array.isArray(fields.pageNumber)
          ? fields.pageNumber[0]
          : fields.pageNumber || "1"
      ) || 1;

    const pdfFile = Array.isArray(files.pdfFile)
      ? files.pdfFile[0]
      : files.pdfFile;

    if (!pdfFile || !textToAdd) {
      return NextResponse.json(
        { error: "No PDF file uploaded or text provided" },
        { status: 400 }
      );
    }

    // Read the uploaded PDF
    const pdfBytes = await fs.readFile(pdfFile.filepath);

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    // Validate page number
    if (pageNumber > pages.length || pageNumber < 1) {
      await fs.unlink(pdfFile.filepath); // Clean up
      return NextResponse.json(
        {
          error: `Invalid page number. PDF has ${pages.length} pages.`,
        },
        { status: 400 }
      );
    }

    // Get the specified page (pageNumber is 1-indexed)
    const page = pages[pageNumber - 1];
    const { height } = page.getSize();

    // Embed font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Add text to the page
    page.drawText(textToAdd, {
      x: xPosition,
      y: height - yPosition, // Convert from top-based to bottom-based coordinates
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });

    // Save the modified PDF
    const modifiedPdfBytes = await pdfDoc.save();

    // Clean up the uploaded file
    await fs.unlink(pdfFile.filepath);

    // Return the modified PDF as response
    return new NextResponse(Buffer.from(modifiedPdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="edited-pdf.pdf"',
      },
    });
  } catch (error: any) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      {
        error: "Failed to process PDF",
        details: error.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
