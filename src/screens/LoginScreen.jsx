import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
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

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      <View style={styles.content}>
        <View style={styles.header}>
          {/* Professional UBL Text Logo */}
          <View >
            <Image source={require('../assets/images/ublimage.png')} style={styles.ublLogo} />
          </View>
          <Text style={styles.title}>ILOS</Text>
          <Text style={styles.subtitle}>Intelligent Loan Origination System</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Agent Name</Text>
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
            <Text style={styles.label}>Agent ID</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your agent ID (e.g., 001)"
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

          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>Available Agents:</Text>
            {AGENT_CREDENTIALS.map((agent, index) => (
              <Text key={agent.id} style={styles.agentText}>
                {agent.name} (ID: {agent.password})
              </Text>
            ))}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B82F6',

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
    marginBottom: 50,
  },
  // logoContainer: {
  //   width: 220,
  //   height: 220,
  //   backgroundColor: '#1E40AF',
  //   // borderRadius: "50%",
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginBottom: 20,
  //   // borderWidth: 2,
  //   borderColor: '#3B82F6',
  //   // shadowColor: '#000',
  //   // shadowOffset: {
  //   //   width: 0,
  //   //   height: 4,
  //   // },
  //   // shadowOpacity: 0.2,
  //   // shadowRadius: 8,
  //   elevation: 8,
  // },
  ublLogo: {
    // width: 150,
    fontSize: 28,
    fontWeight: '900',
    // color: 'white',
    // letterSpacing: 2,
    marginBottom: 30,
    textAlign: 'center',
  },
  ublSubtext: {
    fontSize: 8,
    fontWeight: '600',
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    margin: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: 'white',
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
    color: '#6b7280',
    marginBottom: 4,
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  helpContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  helpText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  agentText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 2,
  },
});

export default LoginScreen;