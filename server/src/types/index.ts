import { Request, Response, NextFunction } from "express";

export interface CustomError extends Error {
  statusCode?: number;
}

export interface EnvironmentVariables {
  PORT: string;
  NODE_ENV?: "development" | "production" | "test";
  FRONTEND_URL?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any; // Add user type if needed
    }
  }
}
