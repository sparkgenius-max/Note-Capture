import { useState, useCallback, useEffect } from "react";
import { createWorker } from "tesseract.js";
import { nanoid } from "nanoid";
import { type DeliveryNote } from "@shared/schema";

const STORAGE_KEY = "delivery_notes_data";

export function useOCR() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [items, setItems] = useState<DeliveryNote[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const processImage = useCallback(async (file: File) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(m.progress * 100);
          }
        },
      });

      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      // Parse extracted text
      const extractedData = parseOCRText(text);
      
      const newItem: DeliveryNote = {
        id: nanoid(),
        ...extractedData,
      };

      setItems((prev) => [newItem, ...prev]);
      return newItem;
    } catch (error) {
      console.error("OCR Error:", error);
      throw error;
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<DeliveryNote>) => {
    setItems((prev) => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter(item => item.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    if (confirm("Are you sure you want to clear all data?")) {
      setItems([]);
    }
  }, []);

  return {
    items,
    processImage,
    isProcessing,
    progress,
    updateItem,
    deleteItem,
    clearAll
  };
}

// Regex helpers for extraction
function parseOCRText(text: string) {
  const lines = text.split('\n');
  
  let supplier = "";
  let reference = "";
  let date = "";
  let productCode = "";
  let quantity = "";

  // Basic keyword matching (can be improved with more complex regex)
  const supplierRegex = /(?:Supplier|From|Vendor):\s*(.*)/i;
  const refRegex = /(?:Delivery Note|DN|Ref)[:.]?\s*([A-Z0-9-]+)/i;
  const dateRegex = /(\d{2}[-/]\d{2}[-/]\d{4})/;
  const skuRegex = /(?:SKU|Code|Product)[:.]?\s*([A-Z0-9-]+)/i;
  const qtyRegex = /(?:Qty|Quantity)[:.]?\s*(\d+)/i;

  // Try to find matches in the full text or line by line
  const supplierMatch = text.match(supplierRegex);
  if (supplierMatch) supplier = supplierMatch[1].trim();

  const refMatch = text.match(refRegex);
  if (refMatch) reference = refMatch[1].trim();

  const dateMatch = text.match(dateRegex);
  if (dateMatch) date = dateMatch[1].trim();

  const skuMatch = text.match(skuRegex);
  if (skuMatch) productCode = skuMatch[1].trim();

  const qtyMatch = text.match(qtyRegex);
  if (qtyMatch) quantity = qtyMatch[1].trim();

  // Fallback: If supplier is empty, assume first non-empty line might be the company name
  if (!supplier) {
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length > 3 && !trimmed.match(/delivery|invoice|date/i)) {
        supplier = trimmed;
        break;
      }
    }
  }

  return { supplier, reference, date, productCode, quantity };
}
