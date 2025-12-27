import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Loader2, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadZoneProps {
  onDrop: (files: File[]) => void;
  isProcessing: boolean;
  progress: number;
}

export function UploadZone({ onDrop, isProcessing, progress }: UploadZoneProps) {
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onDrop(acceptedFiles);
    }
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  return (
    <div className="w-full mb-8">
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer
          h-64 flex flex-col items-center justify-center text-center p-8
          ${isDragActive 
            ? "border-primary bg-primary/5 scale-[1.01] shadow-xl shadow-primary/10" 
            : "border-border hover:border-primary/50 hover:bg-muted/30 hover:shadow-lg"
          }
          ${isProcessing ? "pointer-events-none opacity-90" : ""}
        `}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-4 z-10"
            >
              <div className="relative">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-primary">
                  {Math.round(progress)}%
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Processing Document...</h3>
                <p className="text-muted-foreground mt-1">Extracting text using AI</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-4 z-10"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                {isDragActive ? (
                  <Upload className="w-10 h-10 text-primary" />
                ) : (
                  <div className="relative">
                    <FileText className="w-10 h-10 text-primary" />
                    <ImageIcon className="w-6 h-6 text-primary/60 absolute -bottom-2 -right-2 bg-white rounded-full p-0.5" />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-foreground">
                  {isDragActive ? "Drop file here" : "Upload Delivery Note"}
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Drag & drop an image or PDF here, or click to select files from your computer.
                </p>
              </div>
              
              <div className="mt-4 flex gap-3">
                <span className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground border border-border">JPG</span>
                <span className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground border border-border">PNG</span>
                <span className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground border border-border">PDF</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
