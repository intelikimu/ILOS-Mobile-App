import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { AGENT_CREDENTIALS } from '../utils/config';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    // Check against agent credentials
    const agent = AGENT_CREDENTIALS.find(cred => 
      cred.name.toLowerCase() === username.toLowerCase() && 
      cred.password === password
    );

    if (agent) {
      // Store agent info for use in the app
      global.currentAgent = agent;
      navigation.replace('Home');
    } else {
      Alert.alert('Error', 'Invalid credentials. Please try again.');
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Image
        source={require('../assets/images/ublimage.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />
      
      <Text style={styles.title}>ILOS Mobile</Text>
      <Text style={styles.subtitle}>EAMVU Officer Portal</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={['#3B82F6', '#1E40AF']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      <ScrollView contentContainerStyle={styles.content}>
        {renderHeader()}

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Agent Name</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your full name"
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your Password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.loginAsContainer}>
            <Text style={styles.loginAsText}>Access Level</Text>
            <Text style={styles.roleText}>EAMVU Officer</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#3B82F6',

    // backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    backgroundColor: '#3B82F6',

    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoImage: {
    width: 120,
    height: 80,
    marginBottom: 20,
    tintColor: 'white',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 30,
    marginHorizontal: 20,
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  loginButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#3B82F6',
    fontSize: 18,
    fontWeight: '600',
  },
  loginAsContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  loginAsText: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 4,
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default LoginScreen;