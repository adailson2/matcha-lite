// api/src/health.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({});
export const handler = async () => {
  // simple check that SDK instantiates & env is present
  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      table: process.env.TABLE_NAME || null,
      time: new Date().toISOString(),
    }),
  };
};
