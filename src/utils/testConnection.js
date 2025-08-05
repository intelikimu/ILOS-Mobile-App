import apiService from './api';
import { debugLog, debugError } from './config';

export const testNetworkConnectivity = async () => {
  try {
    console.log('🌐 Testing basic network connectivity...');
    
    // Test 1: Basic fetch to a known endpoint
    const testResponse = await fetch('https://httpbin.org/get', {
      method: 'GET',
      timeout: 5000,
    });
    
    if (testResponse.ok) {
      console.log('✅ Basic internet connectivity: OK');
      return true;
    } else {
      console.log('❌ Basic internet connectivity: Failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Network connectivity test failed:', error.message);
    return false;
  }
};

export const testBackendConnection = async () => {
  try {
    debugLog('🔍 Testing backend connection...');
    
    // First test basic connectivity
    const hasInternet = await testNetworkConnectivity();
    if (!hasInternet) {
      return {
        success: false,
        error: 'No internet connectivity',
        message: 'Please check your internet connection and try again.'
      };
    }
    
    // Test 1: Health check
    console.log('📡 Testing health endpoint...');
    const healthResponse = await apiService.checkHealth();
    console.log('✅ Health check successful:', healthResponse);
    
    // Test 2: EAMVU applications
    console.log('📡 Testing EAMVU applications endpoint...');
    const applicationsResponse = await apiService.getEAMVUApplications();
    console.log('✅ EAMVU applications fetched:', applicationsResponse?.length || 0, 'applications');
    
    return {
      success: true,
      health: healthResponse,
      applications: applicationsResponse,
      message: 'All connection tests passed successfully'
    };
    
  } catch (error) {
    debugError('❌ Connection test failed:', error);
    
    return {
      success: false,
      error: error.message,
      message: 'Connection test failed. Please check your backend server.'
    };
  }
};

export const testSpecificEndpoint = async (endpoint) => {
  try {
    debugLog(`🔍 Testing specific endpoint: ${endpoint}`);
    
    const response = await fetch(`http://10.0.2.2:5000${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Endpoint ${endpoint} successful:`, data);
    
    return {
      success: true,
      data,
      message: `Endpoint ${endpoint} is working correctly`
    };
    
  } catch (error) {
    debugError(`❌ Endpoint ${endpoint} failed:`, error);
    
    return {
      success: false,
      error: error.message,
      message: `Endpoint ${endpoint} failed: ${error.message}`
    };
  }
};

export const runAllTests = async () => {
  console.log('🧪 Running all connection tests...');
  
  const results = {
    network: await testNetworkConnectivity(),
    backend: await testBackendConnection(),
    health: await testSpecificEndpoint('/health'),
    eamvu: await testSpecificEndpoint('/api/applications/department/eamvu'),
  };
  
  console.log('📊 Test Results:', results);
  
  return results;
};

export default {
  testNetworkConnectivity,
  testBackendConnection,
  testSpecificEndpoint,
  runAllTests,
}; 