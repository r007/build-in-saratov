import { Duration, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib';
import {
  BuildSpec,
  ComputeType,
  LinuxBuildImage,
  PipelineProject,
} from 'aws-cdk-lib/aws-codebuild';
import { Artifact, Pipeline, PipelineType } from 'aws-cdk-lib/aws-codepipeline';
import {
  CodeBuildAction,
  CodeStarConnectionsSourceAction,
} from 'aws-cdk-lib/aws-codepipeline-actions';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { BlockPublicAccess, Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import type { Construct } from 'constructs';

export interface PipelineStackProps extends StackProps {
  /** GitHub repository as `owner/name`. */
  repository: string;
  /** Branch whose pushes are deployed. */
  branch: string;
  /**
   * Name of the SSM parameter holding the ARN of the CodeConnections (GitHub)
   * connection to pull through.
   *
   * A parameter rather than a value in `cdk.json` because the ARN contains the
   * account id, which has no business in a public repository. It is resolved
   * by CloudFormation at deploy time, so it never appears in a template either.
   */
  connectionParameter: string;
  /** The stack this pipeline deploys. */
  websiteStackName: string;
}

/**
 * Builds and deploys the website on every push to the branch.
 *
 * One CodeBuild project does everything: install, lint, type-check, build,
 * `cdk deploy`. A failing check stops the run before anything is deployed.
 *
 * The pipeline deploys the website stack only, not itself. It changes rarely,
 * and deploying it by hand (`npx cdk deploy BuildInSaratovPipeline`) keeps a
 * push from being able to rewrite the permissions of the thing that deploys it.
 */
export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const [owner, repo] = props.repository.split('/');
    if (!owner || !repo) {
      throw new Error(`repository must be "owner/name", got "${props.repository}"`);
    }

    const artifacts = new Bucket(this, 'Artifacts', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      lifecycleRules: [{ expiration: Duration.days(30) }],
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const source = new Artifact('Source');

    const deploy = new PipelineProject(this, 'Deploy', {
      description: `Builds and deploys ${props.websiteStackName}`,
      environment: {
        buildImage: LinuxBuildImage.AMAZON_LINUX_2_ARM_3,
        computeType: ComputeType.SMALL,
      },
      timeout: Duration.minutes(30),
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            'runtime-versions': { nodejs: 22 },
            commands: ['node --version', 'npm ci'],
          },
          pre_build: {
            commands: ['npm run lint', 'npm run typecheck'],
          },
          build: {
            commands: [
              'npm run build',
              // `--exclusively`: this stack and nothing it could drag along.
              `npx cdk deploy ${props.websiteStackName} --exclusively --require-approval never`,
            ],
          },
        },
        cache: { paths: ['/root/.npm/**/*'] },
      }),
    });

    // `cdk deploy` does not use this role's own permissions: it assumes the
    // roles created by `cdk bootstrap`, and those carry the actual rights.
    deploy.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['sts:AssumeRole'],
        resources: [`arn:${this.partition}:iam::${this.account}:role/cdk-*`],
        conditions: {
          'ForAnyValue:StringEquals': {
            'iam:ResourceTag/aws-cdk:bootstrap-role': [
              'deploy',
              'file-publishing',
              'image-publishing',
              'lookup',
            ],
          },
        },
      }),
    );

    new Pipeline(this, 'Pipeline', {
      pipelineType: PipelineType.V2,
      artifactBucket: artifacts,
      stages: [
        {
          stageName: 'Source',
          actions: [
            new CodeStarConnectionsSourceAction({
              actionName: 'GitHub',
              owner,
              repo,
              branch: props.branch,
              connectionArn: StringParameter.valueForStringParameter(
                this,
                props.connectionParameter,
              ),
              output: source,
            }),
          ],
        },
        {
          stageName: 'Deploy',
          actions: [
            new CodeBuildAction({ actionName: 'BuildAndDeploy', project: deploy, input: source }),
          ],
        },
      ],
    });
  }
}
