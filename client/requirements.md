## Packages
tesseract.js | Browser-based OCR processing
papaparse | CSV parsing and export
react-dropzone | Drag and drop file uploads
framer-motion | Smooth UI transitions and animations
nanoid | Generating unique IDs for local items

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["Inter", "sans-serif"],
  display: ["Playfair Display", "serif"],
  mono: ["Fira Code", "monospace"],
}

Application is strictly client-side.
Data is stored in localStorage.
No backend API calls should be made.
OCR is performed in the browser using Tesseract.js.
