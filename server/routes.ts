import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // No backend routes needed for this client-side application
  // The frontend handles OCR and data storage via localStorage

  return httpServer;
}
