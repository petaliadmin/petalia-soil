import { InjectionToken } from '@angular/core';

/**
 * API Configuration
 */
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  useMockData: boolean;
}

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG');

/**
 * Default API configuration
 * Set useMockData to false when connecting to real backend
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: 'https://petalia-soil-api.vercel.app', // Petalia Soil API
  timeout: 30000,
  useMockData: true // Set to false to use real API
};
