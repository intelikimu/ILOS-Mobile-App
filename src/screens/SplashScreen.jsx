import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      <View style={styles.logoContainer}>
        {/* Professional UBL Text Logo with Blue Background */}
        <View >
          <Image source={require('../assets/images/ublimage.png')} style={styles.ublLogo} />
          {/* <Text style={styles.ublLogo}>UBL</Text>
          <Text style={styles.ublSubtext}>United Bank Limited</Text> */}
        </View>
        
        <Text style={styles.appName}>ILOS Mobile</Text>
        <Text style={styles.subtitle}>Intelligent Loan Origination System</Text>
        <Text style={styles.forText}>for EAMVU Officers</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B82F6', // Professional UBL Blue
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoBackground: {
    width: 160,
    height: 160,
    backgroundColor: '#3B82F6', // Blue background
    // borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    // borderWidth: 4,
    // borderColor: 'white',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 8,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 12,
    elevation: 15,
  },
  ublLogo: {
    width: 120,
    height: 80,
    tintColor: 'white',
    marginBottom: 30,
  },
  ublSubtext: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: 1,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  forText: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
    textAlign: 'center',
    fontWeight: '400',
  },
});

export default SplashScreen;