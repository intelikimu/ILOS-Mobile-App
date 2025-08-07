// Configuration for ILOS Mobile App

const ENV = {
  development: {
    // For Android emulator, use 10.0.2.2 instead of localhost
    // 10.0.2.2 is the special IP that Android emulator uses to access host machine's localhost
    API_BASE_URL: 'http://10.0.2.2:5000',
    API_TIMEOUT: 30000,
    DEBUG: true,
  },
  staging: {
    API_BASE_URL: 'https://your-staging-backend.vercel.app',
    API_TIMEOUT: 30000,
    DEBUG: true,
  },
  production: {
    API_BASE_URL: 'https://your-production-backend.vercel.app',
    API_TIMEOUT: 30000,
    DEBUG: false,
  },
};

// Get current environment (default to development)
const getCurrentEnv = () => {
  // You can set this via environment variable or build configuration
  return process.env.NODE_ENV || 'development';
};

const currentEnv = getCurrentEnv();
const config = ENV[currentEnv];

// API Configuration
export const API_CONFIG = {
  // Base URL for API calls - Updated to Vercel deployment
  API_BASE_URL: 'https://ilos-backend.vercel.app',
  
  // Timeout settings
  TIMEOUT: 30000, // 30 seconds
  
  // Debug mode
  DEBUG: true,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Health & Status
  HEALTH: '/health',
  
  // Applications - Updated to match new backend structure
  EAMVU_APPLICATIONS: '/api/applications/department/eamvu',
  APPLICATION_DETAILS: (losId) => `/api/applications/form/${losId}`,
  UPDATE_STATUS: '/api/applications/update-status',
  UPDATE_COMMENT: '/api/applications/update-comment',
  APPLICATION_COMMENTS: (losId) => `/api/applications/comments/${losId}`,
  
  // Agent Assignments - New endpoint
  AGENT_ASSIGNMENTS: '/api/applications/test/assignments',
  
  // Customer & CIF
  CUSTOMER_STATUS: '/getNTB_ETB',
  CIF_DETAILS: (consumerId) => `/cif/${consumerId}`,
  
  // Documents
  APPLICATION_DOCUMENTS: (losId) => `/api/documents/${losId}`,
  UPLOAD_DOCUMENT: '/api/upload-document',
  
  // Test Endpoints
  TEST_BACKEND: '/health',
  TEST_APPLICATIONS: '/api/test-applications',
};

// Agent credentials for login
export const AGENT_CREDENTIALS = [
  { id: 'agent-001', name: 'Ahmad Hassan', password: '001' },
  { id: 'agent-002', name: 'Fatima Ali', password: '002' },
  { id: 'agent-003', name: 'Muhammad Khan', password: '003' },
  { id: 'agent-004', name: 'Aisha Sheikh', password: '004' },
  { id: 'agent-005', name: 'Sara Ahmed', password: '005' },
];

// Status mappings for EAMVU - Updated to match new backend status values
export const EAMVU_STATUS_OPTIONS = [
  { value: 'SUBMITTED_TO_COPS', label: 'Submit to COPS', color: '#F59E0B' },
  { value: 'SUBMITTED_TO_CIU', label: 'Submit to CIU', color: '#EF4444' },
  { value: 'SUBMITTED_TO_RRU', label: 'Submit to RRU', color: '#EC4899' },
  { value: 'Application_Returned', label: 'Return Application', color: '#F97316' },
];

// Document status options
export const DOCUMENT_STATUS_OPTIONS = [
  { value: 'Collected', label: '📄 Collected', color: '#10B981' },
  { value: 'Verified', label: '✅ Verified', color: '#059669' },
  { value: 'Rejected', label: '❌ Rejected', color: '#DC2626' },
  { value: 'Pending', label: '⏳ Pending', color: '#F59E0B' },
];

// Application types
export const APPLICATION_TYPES = {
  CASHPLUS: 'CashPlus',
  AUTOLOAN: 'AutoLoan',
  SMEASAAN: 'SMEASAAN',
  COMMERCIAL_VEHICLE: 'CommercialVehicle',
  AMEENDRIVE: 'AmeenDrive',
  PLATINUM_CREDIT_CARD: 'PlatinumCreditCard',
  CLASSIC_CREDIT_CARD: 'ClassicCreditCard',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  UNAUTHORIZED: 'Unauthorized access. Please login again.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Invalid data provided.',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  STATUS_UPDATED: 'Application status updated successfully.',
  COMMENT_UPDATED: 'Comment updated successfully.',
  DOCUMENT_UPDATED: 'Document status updated successfully.',
  DATA_FETCHED: 'Data loaded successfully.',
};

// App constants
export const APP_CONSTANTS = {
  APP_NAME: 'ILOS EAMVU',
  VERSION: '1.0.0',
  BUILD_NUMBER: '1',
  
  // Colors
  PRIMARY_COLOR: '#1E40AF', // UBL Blue
  SECONDARY_COLOR: '#3B82F6',
  SUCCESS_COLOR: '#10B981',
  WARNING_COLOR: '#F59E0B',
  ERROR_COLOR: '#EF4444',
  
  // Status colors - Updated to match new backend status values
  STATUS_COLORS: {
    'SUBMITTED_BY_SPU': '#3B82F6',
    'submitted_by_spu': '#3B82F6',
    'SUBMITTED_TO_COPS': '#F59E0B',
    'submitted_to_cops': '#F59E0B',
    'SUBMITTED_TO_CIU': '#EF4444',
    'submitted_to_ciu': '#EF4444',
    'SUBMITTED_TO_RRU': '#EC4899',
    'submitted_to_rru': '#EC4899',
    'APPROVED': '#059669',
    'approved': '#059669',
    'REJECTED': '#DC2626',
    'rejected': '#DC2626',
    'RETURNED': '#F97316',
    'returned': '#F97316',
    'assigned_to_eavmu_officer': '#3B82F6',
    'returned_by_eavmu_officer': '#059669',
  },
  
  // Priority colors
  PRIORITY_COLORS: {
    'high': '#DC2626',
    'medium': '#F59E0B',
    'low': '#10B981',
  },
};

// Debug utilities
export const debugLog = (message, data = null) => {
  if (config.DEBUG) {
    console.log(`🔍 [DEBUG] ${message}`, data);
  }
};

export const debugError = (message, error = null) => {
  if (config.DEBUG) {
    console.error(`❌ [DEBUG ERROR] ${message}`, error);
  }
};

export default {
  API_CONFIG,
  API_ENDPOINTS,
  EAMVU_STATUS_OPTIONS,
  DOCUMENT_STATUS_OPTIONS,
  APPLICATION_TYPES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  APP_CONSTANTS,
  debugLog,
  debugError,
}; 