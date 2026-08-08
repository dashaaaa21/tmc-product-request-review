import { describe, it, expect } from 'vitest';
import { analysisResultSchema } from '@/lib/validations/analysis.schema';
import { briefResultSchema } from '@/lib/validations/brief.schema';
import { createRequestSchema } from '@/lib/validations/request.schema';

describe('Analysis Validation', () => {
  it('should accept valid analysis data', () => {
    const validData = {
      facts: ['Clear fact about product'],
      missing: ['Missing detail'],
      contradictions: [],
      followUpQuestions: ['What is the quantity?'],
    };

    const result = analysisResultSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject analysis with too short facts', () => {
    const invalidData = {
      facts: ['bad'], // less than 5 chars
      missing: [],
      contradictions: [],
      followUpQuestions: [],
    };

    const result = analysisResultSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject questions without question mark', () => {
    const invalidData = {
      facts: [],
      missing: [],
      contradictions: [],
      followUpQuestions: ['This is not a question'], // no ?
    };

    const result = analysisResultSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject duplicate facts', () => {
    const invalidData = {
      facts: ['Same fact', 'Same fact'], // duplicates
      missing: [],
      contradictions: [],
      followUpQuestions: [],
    };

    const result = analysisResultSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('Brief Validation', () => {
  it('should accept valid brief data', () => {
    const validData = {
      productOverview: 'This is a comprehensive product overview with more than ten words in it.',
      confirmedRequirements: ['Valid requirement'],
      assumptions: ['Valid assumption'],
      openQuestions: ['What is the deadline?'],
      procurementSummary: 'This is a procurement summary with at least fifteen words to meet the minimum requirement.',
    };

    const result = briefResultSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should accept empty confirmed requirements', () => {
    const validData = {
      productOverview: 'This is a comprehensive product overview with more than ten words in it.',
      confirmedRequirements: [], // empty is OK
      assumptions: [],
      openQuestions: [],
      procurementSummary: 'This is a procurement summary with at least fifteen words to meet the minimum requirement.',
    };

    const result = briefResultSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject brief with too short product overview', () => {
    const invalidData = {
      productOverview: 'Too short', // less than 20 chars and 10 words
      confirmedRequirements: [],
      assumptions: [],
      openQuestions: [],
      procurementSummary: 'This is a procurement summary with at least fifteen words to meet the minimum requirement.',
    };

    const result = briefResultSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject questions without question mark', () => {
    const invalidData = {
      productOverview: 'This is a comprehensive product overview with more than ten words in it.',
      confirmedRequirements: [],
      assumptions: [],
      openQuestions: ['Not a question'], // no ?
      procurementSummary: 'This is a procurement summary with at least fifteen words to meet the minimum requirement.',
    };

    const result = briefResultSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('Request Validation', () => {
  it('should accept valid request data', () => {
    const validData = {
      title: 'Valid Product Title',
      description: 'This is a detailed description with more than twenty characters.',
      category: 'merchandise' as const, // must be from enum
    };

    const result = createRequestSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject request with too short title', () => {
    const invalidData = {
      title: 'ab', // less than 3 chars
      description: 'This is a detailed description with more than twenty characters.',
      category: 'merchandise' as const,
    };

    const result = createRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject request with too short description', () => {
    const invalidData = {
      title: 'Valid Title',
      description: 'Too short', // less than 20 chars
      category: 'merchandise' as const,
    };

    const result = createRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject request with invalid category', () => {
    const invalidData = {
      title: 'Valid Title',
      description: 'This is a detailed description with more than twenty characters.',
      category: 'invalid_category', // not in enum
    };

    const result = createRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
