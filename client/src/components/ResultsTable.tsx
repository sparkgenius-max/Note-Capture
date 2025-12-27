import { useState } from "react";
import { type DeliveryNote } from "@shared/schema";
import { 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Download,
  AlertCircle 
} from "lucide-react";
import Papa from "papaparse";
import { motion, AnimatePresence } from "framer-motion";

interface ResultsTableProps {
  items: DeliveryNote[];
  onUpdate: (id: string, updates: Partial<DeliveryNote>) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export function ResultsTable({ items, onUpdate, onDelete, onClear }: ResultsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<DeliveryNote>>({});

  const startEditing = (item: DeliveryNote) => {
    setEditingId(item.id);
    setEditValues(item);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEditing = (id: string) => {
    onUpdate(id, editValues);
    setEditingId(null);
    setEditValues({});
  };

  const handleExport = () => {
    const csv = Papa.unparse(items.map(({ id, ...rest }) => rest));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `delivery_notes_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16 px-4 border-2 border-dashed border-border rounded-3xl bg-card/50">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <AlertCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No Data Yet</h3>
        <p className="text-muted-foreground max-w-xs mx-auto mt-2">
          Upload a delivery note above to start extracting data automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Extracted Data</h2>
          <p className="text-muted-foreground text-sm">{items.length} document{items.length !== 1 ? 's' : ''} processed</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={onClear}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Supplier</th>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Product Code</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`
                      group transition-colors
                      ${editingId === item.id ? "bg-primary/5" : "hover:bg-muted/30"}
                    `}
                  >
                    {editingId === item.id ? (
                      <>
                        <td className="px-4 py-3">
                          <input
                            className="w-full px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            value={editValues.supplier || ""}
                            onChange={(e) => setEditValues({ ...editValues, supplier: e.target.value })}
                            placeholder="Supplier"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            className="w-full px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            value={editValues.reference || ""}
                            onChange={(e) => setEditValues({ ...editValues, reference: e.target.value })}
                            placeholder="Ref No."
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            className="w-full px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            value={editValues.date || ""}
                            onChange={(e) => setEditValues({ ...editValues, date: e.target.value })}
                            placeholder="DD/MM/YYYY"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            className="w-full px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            value={editValues.productCode || ""}
                            onChange={(e) => setEditValues({ ...editValues, productCode: e.target.value })}
                            placeholder="SKU"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            className="w-full px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            value={editValues.quantity || ""}
                            onChange={(e) => setEditValues({ ...editValues, quantity: e.target.value })}
                            placeholder="Qty"
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => saveEditing(item.id)}
                              className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="p-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 font-medium text-foreground">{item.supplier || <span className="text-muted-foreground italic">Missing</span>}</td>
                        <td className="px-6 py-4 font-mono text-xs">{item.reference || <span className="text-muted-foreground italic">Missing</span>}</td>
                        <td className="px-6 py-4">{item.date || <span className="text-muted-foreground italic">Missing</span>}</td>
                        <td className="px-6 py-4 font-mono text-xs">{item.productCode || <span className="text-muted-foreground italic">Missing</span>}</td>
                        <td className="px-6 py-4 font-medium">{item.quantity || <span className="text-muted-foreground italic">-</span>}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEditing(item)}
                              className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDelete(item.id)}
                              className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
