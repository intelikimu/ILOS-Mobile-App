import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if user is already logged in
      if (global.currentAgent) {
        navigation.replace('Home');
      } else {
        navigation.replace('Login');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#3B82F6', '#1D4ED8']}
      style={styles.container}
    >
      <StatusBar backgroundColor="#3B82F6" barStyle="light-content" />
      
      <View style={styles.content}>
        <Image
          source={require('../assets/images/ublimage.png')}
          style={styles.ublLogo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>ILOS Mobile</Text>
        <Text style={styles.subtitle}>EAMVU Officer Portal</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  ublLogo: {
    width: 150,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
});

export default SplashScreen;