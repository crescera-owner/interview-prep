import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Stack, type StackProps } from 'aws-cdk-lib';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { ApplicationProtocol } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import type { Construct } from 'constructs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface ApiStackProps extends StackProps {
  /**
   * ARN of an ACM certificate to terminate HTTPS on the load balancer.
   * Left undefined by default: this is a practice/demo stack with no owned
   * domain, so it falls back to plain HTTP. Pass a real certificate ARN
   * (and point a domain at the resulting load balancer) before putting
   * anything other than throwaway data behind this service.
   */
  certificateArn?: string;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: ApiStackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'ApiVpc', { maxAzs: 2, natGateways: 1 });
    const cluster = new Cluster(this, 'ApiCluster', { vpc });

    const certificate = props?.certificateArn
      ? Certificate.fromCertificateArn(this, 'ApiCertificate', props.certificateArn)
      : undefined;

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
      certificate,
      protocol: certificate ? ApplicationProtocol.HTTPS : ApplicationProtocol.HTTP,
      redirectHTTP: Boolean(certificate),
      publicLoadBalancer: true,
    });
  }
}
