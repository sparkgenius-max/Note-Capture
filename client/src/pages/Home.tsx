import { useOCR } from "@/hooks/use-ocr";
import { UploadZone } from "@/components/UploadZone";
import { ResultsTable } from "@/components/ResultsTable";
import { ScanLine, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const {
    items,
    processImage,
    isProcessing,
    progress,
    updateItem,
    deleteItem,
    clearAll
  } = useOCR();

  const { toast } = useToast();

  const handleFileDrop = async (files: File[]) => {
    if (files.length === 0) return;

    try {
      await processImage(files[0]);
      toast({
        title: "Scan Complete",
        description: "Successfully extracted data from the document.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Could not process the image. Please try a clearer image.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/favicon.png" alt="DocExtract Logo" className="w-9 h-9 object-contain" />
            <h1 className="font-display font-bold text-xl tracking-tight">DocExtract</h1>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <span className="hover:text-primary transition-colors cursor-pointer">How it works</span>
            <span className="hover:text-primary transition-colors cursor-pointer">About</span>
            <a
              href="https://github.com/naptha/tesseract.js"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Powered by Tesseract.js
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12 animate-in">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Delivery Note Capture Tool
          </h2>
          <p className="text-lg text-muted-foreground">
            Instantly extract supplier details, dates, and product codes from your delivery notes.
            No data leaves your browser.
          </p>
        </div>

        {/* Upload Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <UploadZone
            onDrop={handleFileDrop}
            isProcessing={isProcessing}
            progress={progress}
          />

          <div className="flex flex-col md:flex-row gap-6 justify-center text-sm text-muted-foreground mt-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>100% Client-side Processing</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border shadow-sm">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Secure Local Storage</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border shadow-sm">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span>CSV Export Ready</span>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-muted/30 rounded-3xl p-1 md:p-8">
            <ResultsTable
              items={items}
              onUpdate={updateItem}
              onDelete={deleteItem}
              onClear={clearAll}
            />
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-20 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
            <Info className="w-4 h-4" />
            <span>Pro Tip: For best results, ensure images are well-lit and text is clearly visible.</span>
          </div>
          <p>© {new Date().getFullYear()} Delivery Note Capture Tool. Built for efficiency.</p>
        </div>
      </main>
    </div>
  );
}
