import { App } from 'aws-cdk-lib';
import { ApiStack } from '../lib/api-stack.js';

const app = new App();

new ApiStack(app, 'InterviewPrepApiStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? 'us-east-1',
  },
});
