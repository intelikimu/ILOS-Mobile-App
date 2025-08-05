import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Linking,
} from 'react-native';
import { getStatusColor } from '../utils/helpers';

const ApplicationDetailScreen = ({ navigation, route }) => {
  const { application } = route.params;
  const [documents, setDocuments] = useState(application.documents);

  const updateDocumentStatus = (documentId, newStatus) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === documentId ? { ...doc, status: newStatus } : doc
      )
    );
    Alert.alert('Success', `Document status updated to ${newStatus}`);
  };

  const handleDocumentAction = (document) => {
    Alert.alert(
      'Update Document Status',
      `Select new status for ${document.name}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: '📄 Collected', onPress: () => updateDocumentStatus(document.id, 'Collected') },
        { text: '✅ Verified', onPress: () => updateDocumentStatus(document.id, 'Verified') },
        { text: '❌ Rejected', onPress: () => updateDocumentStatus(document.id, 'Rejected') },
      ]
    );
  };

  const handleCallApplicant = () => {
    const phoneNumber = application.applicantPhone.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleOpenMaps = () => {
    const address = encodeURIComponent(application.address);
    Linking.openURL(`https://maps.google.com/?q=${address}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Application Details</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Application Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Application Overview</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>LOS ID:</Text>
              <Text style={styles.value}>{application.losId}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Status:</Text>
              <View style={[styles.badge, { backgroundColor: getStatusColor(application.status) }]}>
                <Text style={styles.badgeText}>{application.status}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Priority:</Text>
              <View style={[styles.badge, { backgroundColor: getStatusColor(application.priority) }]}>
                <Text style={styles.badgeText}>{application.priority}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Assigned Date:</Text>
              <Text style={styles.value}>{application.assignedDate}</Text>
            </View>
          </View>
        </View>

        {/* Applicant Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Applicant Information</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{application.applicantName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Phone:</Text>
              <TouchableOpacity onPress={handleCallApplicant}>
                <Text style={[styles.value, styles.phoneLink]}>{application.applicantPhone}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.addressRow}>
              <Text style={styles.label}>Address:</Text>
              <TouchableOpacity onPress={handleOpenMaps} style={styles.addressContainer}>
                <Text style={[styles.value, styles.addressText]}>{application.address}</Text>
                <Text style={styles.mapLink}>📍 Open in Maps</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Loan Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Loan Information</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Loan Type:</Text>
              <Text style={styles.value}>{application.loanType}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Amount:</Text>
              <Text style={[styles.value, styles.amountText]}>{application.amount}</Text>
            </View>
          </View>
        </View>

        {/* Documents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📁 Required Documents ({documents.length})</Text>
          {documents.map((document) => (
            <View key={document.id} style={styles.documentCard}>
              <View style={styles.documentHeader}>
                <View style={styles.documentInfo}>
                  <Text style={styles.documentName}>{document.name}</Text>
                  <Text style={styles.documentType}>{document.type}</Text>
                  {document.required && (
                    <Text style={styles.requiredText}>⚠️ Required</Text>
                  )}
                </View>
                <View style={[styles.badge, { backgroundColor: getStatusColor(document.status) }]}>
                  <Text style={styles.badgeText}>{document.status}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDocumentAction(document)}
              >
                <Text style={styles.actionButtonText}>Update Status</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Notes */}
        {application.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Special Notes</Text>
            <View style={styles.card}>
              <Text style={styles.notesText}>{application.notes}</Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.section}>
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.callButton} onPress={handleCallApplicant}>
              <Text style={styles.callButtonText}>📞 Call Applicant</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapButton} onPress={handleOpenMaps}>
              <Text style={styles.mapButtonText}>🗺️ Navigate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#3B82F6',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  value: {
    fontSize: 16,
    color: '#1e293b',
    flex: 1,
    textAlign: 'right',
  },
  phoneLink: {
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  addressContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  addressText: {
    textAlign: 'right',
    marginBottom: 4,
  },
  mapLink: {
    fontSize: 14,
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  amountText: {
    fontWeight: 'bold',
    color: '#059669',
    fontSize: 18,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  documentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  documentType: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  requiredText: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  notesText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  callButton: {
    flex: 1,
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  callButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  mapButton: {
    flex: 1,
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  mapButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ApplicationDetailScreen;