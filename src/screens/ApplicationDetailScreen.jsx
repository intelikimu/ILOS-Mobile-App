import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Linking,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from 'react-native';
import { getStatusColor, getPriorityColor } from '../utils/dataTransformer';
import apiService from '../utils/api';

const ApplicationDetailScreen = ({ navigation, route }) => {
  const { application } = route.params;
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [settingsVisible, setSettingsVisible] = useState(false);

  // Fetch application details from backend
  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const losId = application.losId || application.id;
      console.log(`🔄 Fetching details for application: ${losId}`);
      
      // Fetch application details
      const detailsResponse = await apiService.getApplicationDetails(losId);
      if (detailsResponse) {
        setApplicationDetails(detailsResponse);
      }

      // Fetch documents
      try {
        const documentsResponse = await apiService.getApplicationDocuments(losId);
        if (documentsResponse && Array.isArray(documentsResponse)) {
          setDocuments(documentsResponse);
        }
      } catch (docError) {
        console.log('⚠️ Could not fetch documents:', docError.message);
        setDocuments([]);
      }

      // Fetch comments
      try {
        const commentsResponse = await apiService.getApplicationComments(losId);
        if (commentsResponse && commentsResponse.comments) {
          setComments(commentsResponse.comments);
        }
      } catch (commentError) {
        console.log('⚠️ Could not fetch comments:', commentError.message);
        setComments([]);
      }

    } catch (error) {
      console.error('❌ Error fetching application details:', error.message);
      setError(error.message);
      
      Alert.alert(
        'Error',
        'Unable to fetch application details. Please try again.',
        [
          { text: 'OK', onPress: () => setError(null) },
          { text: 'Retry', onPress: fetchApplicationDetails }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchApplicationDetails();
  }, []);

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchApplicationDetails();
    setRefreshing(false);
  };

  // Settings functions
  const handleChangePassword = () => {
    setSettingsVisible(false);
    Alert.alert(
      'Change Password',
      'Password change functionality will be implemented here.',
      [{ text: 'OK' }]
    );
  };

  const handleLogout = () => {
    setSettingsVisible(false);
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // Navigate back to login screen
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  // Update application status
  const updateApplicationStatus = async (newStatus) => {
    try {
      const losId = application.losId || application.id;
      const applicationType = application.applicationType || 'Unknown';
      
      console.log(`🔄 Updating status to: ${newStatus}`);
      await apiService.updateApplicationStatus(losId, newStatus, applicationType);
      
      Alert.alert(
        'Success',
        `Application status updated to ${newStatus}`,
        [{ text: 'OK' }]
      );
      
      // Refresh the application details
      fetchApplicationDetails();
      
    } catch (error) {
      console.error('❌ Error updating status:', error.message);
      Alert.alert(
        'Error',
        'Failed to update application status. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const updateDocumentStatus = (documentId, newStatus) => {
    // This would typically call an API to update document status
    console.log(`Updating document ${documentId} status to ${newStatus}`);
    Alert.alert('Success', `Document status updated to ${newStatus}`);
  };

  const handleDocumentAction = (document) => {
    if (document.url) {
      Linking.openURL(document.url);
    } else {
      Alert.alert('Document', 'Document preview not available');
    }
  };

  const handleCallApplicant = () => {
    const phone = applicationDetails?.applicantPhone || application.applicantPhone;
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert('Error', 'Phone number not available');
    }
  };

  const handleOpenMaps = () => {
    const address = applicationDetails?.address || application.address;
    if (address) {
      const encodedAddress = encodeURIComponent(address);
      Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`);
    } else {
      Alert.alert('Error', 'Address not available');
    }
  };

  const handleStatusUpdate = () => {
    Alert.alert(
      'Update Status',
      'Select new status:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit to COPS', onPress: () => updateApplicationStatus('submitted_to_cops') },
        { text: 'Submit to CIU', onPress: () => updateApplicationStatus('submitted_to_ciu') },
        { text: 'Submit to RRU', onPress: () => updateApplicationStatus('submitted_to_rru') },
        { text: 'Return Application', onPress: () => updateApplicationStatus('returned') },
      ]
    );
  };

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#1E40AF" />
      <Text style={styles.loadingText}>Loading application details...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Error Loading Application</Text>
      <Text style={styles.errorMessage}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={fetchApplicationDetails}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Application Details</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => setSettingsVisible(true)}
          >
            <View style={styles.settingsIcon}>
              <Text style={styles.settingsIconText}>⋮</Text>
            </View>
          </TouchableOpacity>
        </View>
        {renderLoadingState()}
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Application Details</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => setSettingsVisible(true)}
          >
            <View style={styles.settingsIcon}>
              <Text style={styles.settingsIconText}>⋮</Text>
            </View>
          </TouchableOpacity>
        </View>
        {renderErrorState()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Application Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.statusUpdateButton} onPress={handleStatusUpdate}>
            <Text style={styles.statusUpdateButtonText}>Update Status</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => setSettingsVisible(true)}
          >
            <View style={styles.settingsIcon}>
              <Text style={styles.settingsIconText}>⋮</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
      >
        {/* Application Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Application Overview</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>LOS ID:</Text>
              <Text style={styles.value}>{application.losId || `LOS-${application.id}`}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Status:</Text>
              <View style={[styles.badge, { backgroundColor: getStatusColor(application.status) }]}>
                <Text style={styles.badgeText}>{application.status || 'Unknown'}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Priority:</Text>
              <View style={[styles.badge, { backgroundColor: getPriorityColor(application.priority) }]}>
                <Text style={styles.badgeText}>{application.priority || 'Low'}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Loan Type:</Text>
              <Text style={styles.value}>{application.loanType || 'Unknown'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Amount:</Text>
              <Text style={styles.value}>{application.amount || 'PKR 0'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Assigned Date:</Text>
              <Text style={styles.value}>{application.assignedDate || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Applicant Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Applicant Information</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{application.applicantName || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{application.applicantPhone || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{application.address || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Documents Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📄 Documents</Text>
          <View style={styles.card}>
            {documents.length > 0 ? (
              documents.map((document, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.documentItem}
                  onPress={() => handleDocumentAction(document)}
                >
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentName}>{document.name || 'Document'}</Text>
                    <Text style={styles.documentType}>{document.type || 'Unknown Type'}</Text>
                  </View>
                  <View style={[styles.documentStatus, { backgroundColor: getDocumentStatusColor(document.status) }]}>
                    <Text style={styles.documentStatusText}>{document.status || 'Pending'}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noDocumentsText}>No documents available</Text>
            )}
          </View>
        </View>

        {/* Comments Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 Comments</Text>
          <View style={styles.card}>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <View key={index} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>{comment.author || 'Unknown'}</Text>
                    <Text style={styles.commentDate}>{comment.date || 'N/A'}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text || 'No comment text'}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noCommentsText}>No comments available</Text>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCallApplicant}>
              <Text style={styles.actionButtonText}>📞 Call Applicant</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleOpenMaps}>
              <Text style={styles.actionButtonText}>🗺️ View on Map</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Settings Modal */}
      <Modal
        visible={settingsVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSettingsVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSettingsVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Account Settings</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSettingsVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.settingsOption}
              onPress={handleChangePassword}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionIcon}>
                  <Text style={styles.optionIconText}>🔐</Text>
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>Change Password</Text>
                  <Text style={styles.optionSubtitle}>Update your account password</Text>
                </View>
                <Text style={styles.optionArrow}>›</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingsOption}
              onPress={handleLogout}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionIcon}>
                  <Text style={styles.optionIconText}>🚪</Text>
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>Logout</Text>
                  <Text style={styles.optionSubtitle}>Sign out of your account</Text>
                </View>
                <Text style={styles.optionArrow}>›</Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1E40AF',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusUpdateButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 10,
  },
  statusUpdateButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  settingsButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIconText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  documentType: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  documentStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  documentStatusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  noDocumentsText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  commentItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  commentDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  commentText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  noCommentsText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  settingsOption: {
    marginBottom: 12,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionIconText: {
    fontSize: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  optionArrow: {
    fontSize: 18,
    color: '#9ca3af',
    fontWeight: 'bold',
  },
  settingsIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIconText: {
    fontSize: 18,
    color: 'white',
  },
});

const getDocumentStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'verified':
      return '#059669';
    case 'pending':
      return '#d97706';
    case 'rejected':
      return '#dc2626';
    default:
      return '#6b7280';
  }
};

export default ApplicationDetailScreen;