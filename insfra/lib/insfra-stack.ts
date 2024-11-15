import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda_core from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as iam from "aws-cdk-lib/aws-iam";

export class InsfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 bucket for static hosting
    const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      bucketName: "milaganan-bucket",
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [
        s3deploy.Source.asset(
          path.join(__dirname, "../..", "apps/frontend/dist"),
        ),
      ],
      destinationBucket: websiteBucket,
      memoryLimit: 512,
      prune: false
    });

    // Add this after the bucket deployment
    new cdk.CfnOutput(this, "WebsiteUrl", {
      value: websiteBucket.bucketWebsiteUrl,
      description: "The URL of the website",
    });

    const apiLambda = new lambda_core.Function(this, "ApiNestHandler", {
      code: lambda_core.Code.fromAsset(
        path.join(__dirname, "../../apps/api/dist"),
      ),
      functionName: "api-lambda-handler",
      runtime: lambda_core.Runtime.NODEJS_18_X,
      handler: "main.handler",
      environment: {
        AWS_BUCKET_NAME: websiteBucket.bucketName,
      },
      timeout: cdk.Duration.seconds(60),
      memorySize: 256,
    });

    // Grant the Lambda function write permissions to the S3 bucket
    websiteBucket.grantWrite(apiLambda);

    // Create an API Gateway as a proxy for the Lambda function
    const api = new apigateway.LambdaRestApi(this, "ApiGateway", {
      handler: apiLambda,
      proxy: true,
      binaryMediaTypes: ["*/*", "multipart/form-data", "image/*"],
      defaultCorsPreflightOptions: {
        allowOrigins: ['*'],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'X-Requested-With'],
        maxAge: cdk.Duration.seconds(3600),
      }
    });

    // Update the permissions section
    const bucketPolicy = new iam.PolicyStatement({
      actions: [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket",
      ],
      resources: [websiteBucket.bucketArn, `${websiteBucket.bucketArn}/*`],
    });

    apiLambda.addToRolePolicy(bucketPolicy);
  }
}
