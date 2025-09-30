// mobile/src/components/SignUpScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { signUp } from 'aws-amplify/auth';

interface SignUpScreenProps {
  onSignUpSuccess: () => void;
  onSwitchToSignIn: () => void;
}

export default function SignUpScreen({
  onSignUpSuccess,
  onSwitchToSignIn,
}: SignUpScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !firstName || !lastName || !birthdate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            given_name: firstName,
            family_name: lastName,
            birthdate,
          },
          autoSignIn: false,
        },
      });

      Alert.alert(
        'Check your email',
        'We sent you a verification code. Please check your email and verify your account.',
        [{ text: 'OK', onPress: onSignUpSuccess }]
      );
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join Matcha Lite</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder='First Name'
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize='words'
        />

        <TextInput
          style={styles.input}
          placeholder='Last Name'
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize='words'
        />

        <TextInput
          style={styles.input}
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder='Birthdate (YYYY-MM-DD)'
          value={birthdate}
          onChangeText={setBirthdate}
        />

        <TextInput
          style={styles.input}
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.passwordHint}>
          Password must be at least 8 characters with uppercase, lowercase,
          numbers, and symbols
        </Text>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={onSwitchToSignIn}
        >
          <Text style={styles.switchText}>
            Already have an account? Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  passwordHint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
  },
  switchText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
