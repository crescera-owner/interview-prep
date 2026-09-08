import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Stack, type StackProps } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import type { Construct } from 'constructs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'ApiVpc', { maxAzs: 2, natGateways: 1 });
    const cluster = new Cluster(this, 'ApiCluster', { vpc });

    new ApplicationLoadBalancedFargateService(this, 'ApiService', {
      cluster,
      cpu: 256,
      memoryLimitMiB: 512,
      desiredCount: 1,
      taskImageOptions: {
        // Builds packages/api/Dockerfile into an image and pushes it to ECR
        // as part of `cdk deploy` — no manual docker push step needed.
        image: ContainerImage.fromAsset(path.join(__dirname, '../../..'), {
          file: 'packages/api/Dockerfile',
        }),
        containerPort: 3000,
        environment: {
          NODE_ENV: 'production',
        },
      },
      publicLoadBalancer: true,
    });
  }
}
