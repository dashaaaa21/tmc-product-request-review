/**
 * Service layer types and interfaces
 * These types define the contract between services and API routes
 */

import { ProductRequest } from "@/types/request.types";
import { AnalysisResult } from "@/types/analysis.types";
import { BriefResult } from "@/types/brief.types";

/**
 * Generic service result wrapper
 */
export type ServiceResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: ServiceError;
};

/**
 * Service error type
 */
export interface ServiceError {
  message: string;
  code: string;
  statusCode: number;
  details?: unknown;
}

/**
 * Request service interfaces
 */
export interface IRequestService {
  createRequest(
    userId: string,
    title: string,
    description: string,
    category: string
  ): Promise<ProductRequest>;

  getRequests(userId: string): Promise<ProductRequest[]>;

  getRequest(userId: string, requestId: string): Promise<ProductRequest | null>;

  updateRequest(
    userId: string,
    requestId: string,
    updates: Partial<Pick<ProductRequest, "title" | "description" | "category" | "status">>
  ): Promise<ProductRequest>;

  deleteRequest(userId: string, requestId: string): Promise<void>;
}

/**
 * Analysis service interfaces
 */
export interface IAnalysisService {
  analyzeRequest(requestText: string): Promise<AnalysisResult>;

  saveAnalysis(requestId: string, analysis: AnalysisResult): Promise<void>;

  getAnalysis(requestId: string, userId: string): Promise<AnalysisResult | null>;
}

/**
 * Brief service interfaces
 */
export interface IBriefService {
  generateBrief(requestText: string, analysis: AnalysisResult): Promise<BriefResult>;

  saveBrief(requestId: string, brief: BriefResult): Promise<void>;

  getBrief(requestId: string, userId: string): Promise<BriefResult | null>;
}

/**
 * Options for service operations
 */
export interface ServiceOptions {
  /**
   * Whether to throw errors or return them in the result
   */
  throwOnError?: boolean;

  /**
   * Timeout in milliseconds for the operation
   */
  timeout?: number;

  /**
   * Additional context for error messages
   */
  context?: string;
}
