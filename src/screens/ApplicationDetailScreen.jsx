import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Linking,
  Modal,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import apiService from '../utils/api';
import { transformApplicationDetails } from '../utils/dataTransformer';
import { API_CONFIG, APP_CONSTANTS } from '../utils/config';

const ApplicationDetailScreen = ({ route, navigation }) => {
  const { application } = route.params;
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visitModalVisible, setVisitModalVisible] = useState(false);
  const [visitStatus, setVisitStatus] = useState('pending'); // pending, in-progress, completed

  useEffect(() => {
    fetchApplicationDetails();
  }, []);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching details for application:', application.losId);
      const details = await apiService.getApplicationDetails(application.losId);
      
      console.log('✅ Application details fetched:', details);
      setApplicationDetails(details);
      
    } catch (error) {
      console.error('❌ Error fetching application details:', error);
      setError(error.message);
      
      Alert.alert(
        'Error',
        'Failed to fetch application details. Please try again.',
        [
          { text: 'OK', onPress: () => setError(null) },
          { text: 'Retry', onPress: fetchApplicationDetails }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCallApplicant = () => {
    if (applicationDetails?.formData?.mobile) {
      Linking.openURL(`tel:${applicationDetails.formData.mobile}`);
    }
  };

  const handleOpenMaps = () => {
    if (applicationDetails?.formData?.address) {
      const address = encodeURIComponent(applicationDetails.formData.address);
      Linking.openURL(`https://maps.google.com/?q=${address}`);
    }
  };

  const handleStartVisit = () => {
    setVisitStatus('in-progress');
    setVisitModalVisible(true);
  };

  const handleMarkVisited = () => {
    setVisitStatus('completed');
    Alert.alert('Visit Completed', 'Application has been marked as visited.');
  };

  const handleLogout = () => {
    global.currentAgent = null;
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const renderHeader = () => (
    <LinearGradient
      colors={['#3B82F6', '#1D4ED8']}
      style={styles.header}
    >
      <StatusBar backgroundColor="#3B82F6" barStyle="light-content" />
      
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>Application Details</Text>
          <Text style={styles.headerSubtitle}>{application.losId}</Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Update Status</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingsButton}>
            <Icon name="more-vert" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text style={styles.loadingText}>Loading application details...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Icon name="error" size={48} color="#EF4444" />
      <Text style={styles.errorTitle}>Error Loading Details</Text>
      <Text style={styles.errorMessage}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={fetchApplicationDetails}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderApplicantInfo = () => {
    if (!applicationDetails?.formData) return null;
    
    const data = applicationDetails.formData;
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="person" size={20} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Applicant Information</Text>
        </View>
        
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full Name:</Text>
            <Text style={styles.infoValue}>
              {`${data.first_name || ''} ${data.middle_name || ''} ${data.last_name || ''}`.trim()}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>CNIC:</Text>
            <Text style={styles.infoValue}>{data.cnic || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mobile:</Text>
            <Text style={styles.infoValue}>{data.mobile || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Father/Husband:</Text>
            <Text style={styles.infoValue}>{data.father_or_husband_name || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth:</Text>
            <Text style={styles.infoValue}>{data.date_of_birth || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Marital Status:</Text>
            <Text style={styles.infoValue}>{data.marital_status || 'N/A'}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderAddressInfo = () => {
    if (!applicationDetails?.formData) return null;
    
    const data = applicationDetails.formData;
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="location-on" size={20} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Address Information</Text>
        </View>
        
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Address:</Text>
            <Text style={styles.infoValue}>{data.address || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>City:</Text>
            <Text style={styles.infoValue}>{data.city || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Permanent Address:</Text>
            <Text style={styles.infoValue}>{data.permanent_street || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Permanent City:</Text>
            <Text style={styles.infoValue}>{data.permanent_city || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Residing Since:</Text>
            <Text style={styles.infoValue}>{data.residing_since || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Accommodation Type:</Text>
            <Text style={styles.infoValue}>{data.accommodation_type || 'N/A'}</Text>
          </View>
          
          <TouchableOpacity style={styles.mapButton} onPress={handleOpenMaps}>
            <Icon name="map" size={20} color="#3B82F6" />
            <Text style={styles.mapButtonText}>Open in Maps</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmploymentInfo = () => {
    if (!applicationDetails?.formData) return null;
    
    const data = applicationDetails.formData;
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="work" size={20} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Employment Information</Text>
        </View>
        
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Employment Status:</Text>
            <Text style={styles.infoValue}>{data.employment_status || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Company Name:</Text>
            <Text style={styles.infoValue}>{data.company_name || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Designation:</Text>
            <Text style={styles.infoValue}>{data.designation || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Office Address:</Text>
            <Text style={styles.infoValue}>{data.office_street || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Office City:</Text>
            <Text style={styles.infoValue}>{data.office_city || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Office Phone:</Text>
            <Text style={styles.infoValue}>{data.office_tel1 || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Experience (Current):</Text>
            <Text style={styles.infoValue}>{data.exp_curren_t_years || 'N/A'} years</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gross Monthly Salary:</Text>
            <Text style={styles.infoValue}>{data.gross_monthly_salary ? `PKR ${data.gross_monthly_salary}` : 'N/A'}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderFinancialInfo = () => {
    if (!applicationDetails?.formData) return null;
    
    const data = applicationDetails.formData;
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="account-balance" size={20} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Financial Information</Text>
        </View>
        
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Amount Requested:</Text>
            <Text style={styles.infoValue}>{data.amount_requested ? `PKR ${data.amount_requested}` : 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Net Monthly Income:</Text>
            <Text style={styles.infoValue}>{data.net_monthly_income ? `PKR ${data.net_monthly_income}` : 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Other Monthly Income:</Text>
            <Text style={styles.infoValue}>{data.other_monthly_income ? `PKR ${data.other_monthly_income}` : 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Monthly Rent:</Text>
            <Text style={styles.infoValue}>{data.monthly_rent ? `PKR ${data.monthly_rent}` : 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>UBL Account Number:</Text>
            <Text style={styles.infoValue}>{data.ubl_account_number || 'N/A'}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderReferences = () => {
    if (!applicationDetails?.formData?.references) return null;
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="people" size={20} color="#3B82F6" />
          <Text style={styles.sectionTitle}>References</Text>
        </View>
        
        <View style={styles.card}>
          {applicationDetails.formData.references.map((ref, index) => (
            <View key={ref.id} style={styles.referenceItem}>
              <Text style={styles.referenceTitle}>Reference {index + 1}</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name:</Text>
                <Text style={styles.infoValue}>{ref.name || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Mobile:</Text>
                <Text style={styles.infoValue}>{ref.mobile || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Relationship:</Text>
                <Text style={styles.infoValue}>{ref.relationship || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Address:</Text>
                <Text style={styles.infoValue}>{`${ref.street || ''} ${ref.city || ''}`.trim() || 'N/A'}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderVisitActions = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="assignment" size={20} color="#3B82F6" />
        <Text style={styles.sectionTitle}>Visit Actions</Text>
      </View>
      
      <View style={styles.card}>
        <View style={styles.visitStatus}>
          <Text style={styles.visitStatusLabel}>Visit Status:</Text>
          <View style={[styles.statusBadge, { backgroundColor: visitStatus === 'completed' ? '#059669' : visitStatus === 'in-progress' ? '#F59E0B' : '#6B7280' }]}>
            <Text style={styles.statusBadgeText}>{visitStatus.toUpperCase()}</Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]} 
            onPress={handleStartVisit}
            disabled={visitStatus === 'completed'}
          >
            <Icon name="play-arrow" size={20} color="white" />
            <Text style={styles.primaryButtonText}>Start Visit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]} 
            onPress={handleCallApplicant}
          >
            <Icon name="phone" size={20} color="#3B82F6" />
            <Text style={styles.secondaryButtonText}>Call Applicant</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.successButton]} 
            onPress={handleMarkVisited}
            disabled={visitStatus !== 'in-progress'}
          >
            <Icon name="check-circle" size={20} color="white" />
            <Text style={styles.successButtonText}>Mark Visited</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        {renderLoadingState()}
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        {renderErrorState()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderApplicantInfo()}
        {renderAddressInfo()}
        {renderEmploymentInfo()}
        {renderFinancialInfo()}
        {renderReferences()}
        {renderVisitActions()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    flex: 2,
    textAlign: 'right',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  mapButtonText: {
    color: '#3B82F6',
    fontWeight: '600',
    marginLeft: 8,
  },
  referenceItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 12,
    marginBottom: 12,
  },
  referenceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  visitStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  visitStatusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  secondaryButtonText: {
    color: '#3B82F6',
    fontWeight: '600',
    marginLeft: 8,
  },
  successButton: {
    backgroundColor: '#059669',
  },
  successButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default ApplicationDetailScreen;