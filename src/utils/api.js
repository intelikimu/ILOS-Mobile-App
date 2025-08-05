import axios from 'axios';
import { API_CONFIG, API_ENDPOINTS, ERROR_MESSAGES, debugLog, debugError } from './config';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    debugLog(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    debugError('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
apiClient.interceptors.response.use(
  (response) => {
    debugLog(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    debugError('API Response Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

// Error handler utility
const handleApiError = (error, customMessage = null) => {
  let message = customMessage;

  if (!message) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      message = ERROR_MESSAGES.TIMEOUT_ERROR;
    } else if (error.response?.status === 401) {
      message = ERROR_MESSAGES.UNAUTHORIZED;
    } else if (error.response?.status === 404) {
      message = ERROR_MESSAGES.NOT_FOUND;
    } else if (error.response?.status >= 500) {
      message = ERROR_MESSAGES.SERVER_ERROR;
    } else if (error.message.includes('Network Error')) {
      message = ERROR_MESSAGES.NETWORK_ERROR;
    } else {
      message = ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  }

  return new Error(message);
};

// API Service Class
class ILOSApiService {
  // Health Check
  async checkHealth() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.HEALTH);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Health check failed');
    }
  }

  // EAMVU Applications
  async getEAMVUApplications() {
    try {
      debugLog('Fetching EAMVU applications...');
      console.log('🔍 API Base URL:', API_CONFIG.BASE_URL);
      console.log('🔍 Full URL:', `${API_CONFIG.BASE_URL}${API_ENDPOINTS.EAMVU_APPLICATIONS}`);
      
      const response = await apiClient.get(API_ENDPOINTS.EAMVU_APPLICATIONS);
      
      console.log('✅ API Response received:', response.status);
      console.log('✅ Response data type:', typeof response.data);
      console.log('✅ Response data length:', Array.isArray(response.data) ? response.data.length : 'Not an array');
      
      if (response.data && Array.isArray(response.data)) {
        debugLog(`Successfully fetched ${response.data.length} EAMVU applications`);
        return response.data;
      } else {
        debugLog('No applications found or invalid response format');
        console.log('⚠️ Response data:', response.data);
        return [];
      }
    } catch (error) {
      console.error('❌ Detailed error info:', {
        message: error.message,
        code: error.code,
        response: error.response?.status,
        responseData: error.response?.data,
        config: error.config?.url,
        baseURL: API_CONFIG.BASE_URL,
      });
      throw handleApiError(error, 'Failed to fetch EAMVU applications');
    }
  }

  // Application Details
  async getApplicationDetails(losId) {
    try {
      debugLog(`Fetching application details for LOS ID: ${losId}`);
      const response = await apiClient.get(API_ENDPOINTS.APPLICATION_DETAILS(losId));
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch application details');
    }
  }

  // Update Application Status
  async updateApplicationStatus(losId, status, applicationType) {
    try {
      debugLog(`Updating application status: ${losId} -> ${status}`);
      const response = await apiClient.post(API_ENDPOINTS.UPDATE_STATUS, {
        losId,
        status,
        applicationType,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to update application status');
    }
  }

  // Update Application Comment
  async updateApplicationComment(losId, fieldName, commentText) {
    try {
      debugLog(`Updating comment for LOS ID: ${losId}, Field: ${fieldName}`);
      const response = await apiClient.post(API_ENDPOINTS.UPDATE_COMMENT, {
        losId,
        fieldName,
        commentText,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to update application comment');
    }
  }

  // Get Application Comments
  async getApplicationComments(losId) {
    try {
      debugLog(`Fetching comments for LOS ID: ${losId}`);
      const response = await apiClient.get(API_ENDPOINTS.APPLICATION_COMMENTS(losId));
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch application comments');
    }
  }

  // Customer Status Check
  async checkCustomerStatus(cnic) {
    try {
      debugLog(`Checking customer status for CNIC: ${cnic}`);
      const response = await apiClient.post(API_ENDPOINTS.CUSTOMER_STATUS, { cnic });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to check customer status');
    }
  }

  // Get CIF Details
  async getCIFDetails(consumerId) {
    try {
      debugLog(`Fetching CIF details for consumer ID: ${consumerId}`);
      const response = await apiClient.get(API_ENDPOINTS.CIF_DETAILS(consumerId));
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch CIF details');
    }
  }

  // Document Management
  async getApplicationDocuments(losId) {
    try {
      debugLog(`Fetching documents for LOS ID: ${losId}`);
      const response = await apiClient.get(API_ENDPOINTS.APPLICATION_DOCUMENTS(losId));
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch application documents');
    }
  }

  // Upload Document
  async uploadDocument(losId, documentData) {
    try {
      debugLog(`Uploading document for LOS ID: ${losId}`);
      const formData = new FormData();
      formData.append('losId', losId);
      formData.append('document', documentData);

      const response = await apiClient.post(API_ENDPOINTS.UPLOAD_DOCUMENT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to upload document');
    }
  }

  // Test Backend Connection
  async testBackendConnection() {
    try {
      debugLog('Testing backend connection...');
      const response = await apiClient.get(API_ENDPOINTS.TEST_BACKEND);
      return {
        success: true,
        status: response.status,
        data: response.data,
        message: 'Backend connection successful',
      };
    } catch (error) {
      debugError('Backend connection test failed:', error);
      return {
        success: false,
        error: error.message,
        status: error.response?.status,
        message: 'Backend connection failed',
      };
    }
  }

  // Test Applications Endpoint
  async testApplicationsEndpoint() {
    try {
      debugLog('Testing applications endpoint...');
      const response = await apiClient.get(API_ENDPOINTS.TEST_APPLICATIONS);
      return {
        success: true,
        status: response.status,
        data: response.data,
        message: 'Applications endpoint working',
      };
    } catch (error) {
      debugError('Applications endpoint test failed:', error);
      return {
        success: false,
        error: error.message,
        status: error.response?.status,
        message: 'Applications endpoint failed',
      };
    }
  }

  // Batch Operations
  async batchUpdateApplications(updates) {
    try {
      debugLog(`Batch updating ${updates.length} applications`);
      const promises = updates.map(update => 
        this.updateApplicationStatus(update.losId, update.status, update.applicationType)
      );
      const results = await Promise.allSettled(promises);
      
      const successful = results.filter(result => result.status === 'fulfilled');
      const failed = results.filter(result => result.status === 'rejected');
      
      debugLog(`Batch update completed: ${successful.length} successful, ${failed.length} failed`);
      
      return {
        successful: successful.length,
        failed: failed.length,
        results,
      };
    } catch (error) {
      throw handleApiError(error, 'Failed to batch update applications');
    }
  }

  // Get Application Statistics
  async getApplicationStatistics() {
    try {
      debugLog('Fetching application statistics...');
      const applications = await this.getEAMVUApplications();
      
      const stats = {
        total: applications.length,
        byStatus: {},
        byPriority: {},
        byType: {},
      };

      applications.forEach(app => {
        // Count by status
        const status = app.status || 'Unknown';
        stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

        // Count by priority
        const priority = app.priority || 'Low';
        stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1;

        // Count by type
        const type = app.applicationType || 'Unknown';
        stats.byType[type] = (stats.byType[type] || 0) + 1;
      });

      return stats;
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch application statistics');
    }
  }
}

// Create and export the API service instance
const apiService = new ILOSApiService();

export default apiService; 