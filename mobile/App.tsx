// App.tsx
import React, { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { StatusBar } from 'expo-status-bar';
import './src/amplify-config'; // Initialize Amplify

import SignInScreen from './src/components/SignInScreen';
import SignUpScreen from './src/components/SignUpScreen';
import MainScreen from './src/components/MainScreen';

type AuthState = 'loading' | 'signin' | 'signup' | 'authenticated';

export default function App() {
  const [authState, setAuthState] = useState<AuthState>('loading');

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      await getCurrentUser();
      setAuthState('authenticated');
    } catch (error) {
      setAuthState('signin');
    }
  };

  const handleSignInSuccess = () => {
    setAuthState('authenticated');
  };

  const handleSignUpSuccess = () => {
    setAuthState('signin');
  };

  const handleSignOut = () => {
    setAuthState('signin');
  };

  const switchToSignUp = () => {
    setAuthState('signup');
  };

  const switchToSignIn = () => {
    setAuthState('signin');
  };

  if (authState === 'loading') {
    return null; // Could add a loading screen here
  }

  if (authState === 'signin') {
    return (
      <>
        <StatusBar style='auto' />
        <SignInScreen
          onSignInSuccess={handleSignInSuccess}
          onSwitchToSignUp={switchToSignUp}
        />
      </>
    );
  }

  if (authState === 'signup') {
    return (
      <>
        <StatusBar style='auto' />
        <SignUpScreen
          onSignUpSuccess={handleSignUpSuccess}
          onSwitchToSignIn={switchToSignIn}
        />
      </>
    );
  }

  return (
    <>
      <StatusBar style='auto' />
      <MainScreen onSignOut={handleSignOut} />
    </>
  );
}
