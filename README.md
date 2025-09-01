# RuneBind

RuneBind is a modern, professional PDF processing web application built with Next.js. It offers a clean, intuitive interface for merging, splitting, compressing, and converting PDFs with a focus on privacy and ease of use.

## Features

- **Merge PDFs**: Combine multiple PDF files into a single document
- **Split PDFs**: Extract specific pages or ranges from PDFs
- **Compress PDFs**: Reduce file size while maintaining quality
- **Convert to JPG**: Transform PDF pages into high-quality images
- **Privacy-first**: Files auto-delete after 1 hour
- **No registration required**: Start using immediately
- **Mobile responsive**: Works seamlessly on all devices

## Design

Built with a "Cool & Serene" color scheme featuring:
- Professional blue accents (#3498DB)
- Clean green success states (#2ECC71)
- Subtle gray backgrounds for optimal readability
- Consistent, minimal design for easy navigation

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **PDF Processing**: pdf-lib
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```

2. Run the development server:
   ```sh
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload**: Drag and drop PDF files or click to browse
2. **Select Tool**: Choose from merge, split, compress, or convert options
3. **Configure**: Set your preferences (page ranges, quality, etc.)
4. **Process**: Click the action button to process your files
5. **Download**: Get your processed PDF instantly

## File Limits

- Maximum file size: 50MB per file
- Maximum files for merge: 10 files
- Supported format: PDF only

## Privacy & Security

- Files are processed in memory and never stored permanently
- Automatic deletion after 1 hour
- No user accounts or data collection
- Secure HTTPS connections

## Development

```sh
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## License

MIT License - feel free to use this project for your own needs.
