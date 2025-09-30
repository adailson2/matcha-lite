// mobile/src/amplify-config.ts
import { Amplify } from 'aws-amplify';

// These will be set from environment variables after deployment
const userPoolId = process.env.EXPO_PUBLIC_USER_POOL_ID;
const userPoolClientId = process.env.EXPO_PUBLIC_USER_POOL_CLIENT_ID;
const region = process.env.EXPO_PUBLIC_AWS_REGION || 'sa-east-1';

if (!userPoolId || !userPoolClientId) {
  throw new Error(
    'Missing Cognito configuration. Please set EXPO_PUBLIC_USER_POOL_ID and EXPO_PUBLIC_USER_POOL_CLIENT_ID'
  );
}

export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId,
      region,
      signUpVerificationMethod: 'code', // email verification code
    },
  },
};

// Configure Amplify
Amplify.configure(amplifyConfig);

export default amplifyConfig;
