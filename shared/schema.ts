import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const deliveryNotes = pgTable("delivery_notes", {
  id: text("id").primaryKey(),
  supplier: text("supplier"),
  reference: text("reference"),
  date: text("date"),
  productCode: text("product_code"),
  quantity: text("quantity"),
});

export const insertDeliveryNoteSchema = createInsertSchema(deliveryNotes);
export type InsertDeliveryNote = z.infer<typeof insertDeliveryNoteSchema>;
export type DeliveryNote = typeof deliveryNotes.$inferSelect;
