import {
  Stack,
  StackProps,
  CfnOutput,
  Duration,
  RemovalPolicy,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Cognito User Pool for authentication
    const userPool = new cognito.UserPool(this, 'MatchaUserPool', {
      userPoolName: 'matcha-lite-users',
      signInAliases: {
        email: true,
      },
      selfSignUpEnabled: true,
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
        givenName: {
          required: true,
          mutable: true,
        },
        familyName: {
          required: true,
          mutable: true,
        },
        birthdate: {
          required: true,
          mutable: true,
        },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: RemovalPolicy.DESTROY, // for demo purposes
    });

    // User Pool Client for mobile app
    const userPoolClient = new cognito.UserPoolClient(
      this,
      'MatchaUserPoolClient',
      {
        userPool,
        userPoolClientName: 'matcha-lite-mobile',
        generateSecret: false, // Mobile apps don't need client secret
        authFlows: {
          userSrp: true, // Secure Remote Password
          userPassword: true, // For testing
          adminUserPassword: true, // For admin operations
        },
        refreshTokenValidity: Duration.days(30),
        accessTokenValidity: Duration.hours(1),
        idTokenValidity: Duration.hours(1),
      }
    );

    const table = new dynamodb.Table(this, 'MatchaTable', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const healthFn = new lambda.NodejsFunction(this, 'HealthFn', {
      entry: '../api/src/health.ts', // make sure this file exists
      handler: 'handler',
      memorySize: 256,
      timeout: Duration.seconds(5),
      environment: { TABLE_NAME: table.tableName },
    });
    table.grantReadData(healthFn);

    const httpApi = new apigwv2.HttpApi(this, 'HttpApi');

    httpApi.addRoutes({
      path: '/health',
      methods: [apigwv2.HttpMethod.GET],
      integration: new integrations.HttpLambdaIntegration(
        'HealthInt',
        healthFn
      ),
    });

    new CfnOutput(this, 'ApiUrl', { value: httpApi.apiEndpoint });
    new CfnOutput(this, 'TableName', { value: table.tableName });
    new CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });
  }
}
