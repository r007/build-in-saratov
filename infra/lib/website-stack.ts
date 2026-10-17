import { join } from 'node:path';
import { CfnOutput, Duration, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import {
  AllowedMethods,
  CacheCookieBehavior,
  CacheHeaderBehavior,
  CachePolicy,
  CacheQueryStringBehavior,
  Distribution,
  Function as CloudFrontFunction,
  FunctionCode,
  FunctionEventType,
  FunctionRuntime,
  HeadersFrameOption,
  HeadersReferrerPolicy,
  HttpVersion,
  LambdaEdgeEventType,
  OriginRequestPolicy,
  PriceClass,
  ResponseHeadersPolicy,
  ViewerProtocolPolicy,
  type BehaviorOptions,
} from 'aws-cdk-lib/aws-cloudfront';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { AaaaRecord, ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { BlockPublicAccess, Bucket, BucketEncryption, ObjectOwnership } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, CacheControl, Source } from 'aws-cdk-lib/aws-s3-deployment';
import type { Construct } from 'constructs';
import { viewerRequestSource } from './viewer-request.ts';

const ROOT = join(import.meta.dirname, '../..');

/** Where `react-router build` puts the browser bundle and static files. */
const CLIENT_BUILD = join(ROOT, 'build/client');

/**
 * Paths in the client build whose names carry a content hash. A changed file
 * is a different URL, so these can be cached forever.
 */
const IMMUTABLE_PATHS = ['assets/*', 'media/*'];

/**
 * Static files with stable names, served from the bucket rather than rendered.
 *
 * CloudFront routes by the most specific matching pattern; anything not listed
 * here or in `IMMUTABLE_PATHS` goes to the renderer, which answers an unknown
 * path with the 404 page. A new file added to `public/` therefore needs an
 * entry — otherwise it is deployed to the bucket and never reached.
 */
const STATIC_PATHS = ['*.png', '*.ico', 'manifest.webmanifest', 'sw.js'];

/** Query parameters the application reads. Only these split the page cache. */
const CACHED_QUERY_STRINGS = ['q', '_routes', 'index'];

export interface WebsiteStackProps extends StackProps {
  /** The apex domain, e.g. `example.com`. `www.` is served as an alias of it. */
  domainName: string;
  /** Route 53 hosted zone that is authoritative for `domainName`. */
  hostedZoneId: string;
  /** Put the domain on the distribution and point DNS at it. */
  attachDomain: boolean;
  /** Verified SES address that contact form messages are sent from and to. */
  contactEmail: string;
}

/**
 * The website: a CloudFront distribution whose default behaviour is a
 * Lambda@Edge function rendering the React Router app, with hashed assets and
 * images served straight from S3.
 *
 * The shape of a request:
 *
 * 1. A CloudFront Function normalises the host and the trailing slash.
 * 2. CloudFront looks in its cache. Rendered pages are stored there, so this is
 *    where almost every request ends — at the edge, without running any code.
 * 3. On a miss, the Lambda@Edge function renders the page close to the reader
 *    and says how long the result may be kept.
 */
export class WebsiteStack extends Stack {
  constructor(scope: Construct, id: string, props: WebsiteStackProps) {
    super(scope, id, props);

    const { domainName, attachDomain } = props;
    const aliasName = `www.${domainName}`;

    const zone = HostedZone.fromHostedZoneAttributes(this, 'Zone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: domainName,
    });

    /*
     * Issued whether or not the domain is attached yet. Validation is by DNS
     * records in the zone above, which do not touch the records that route
     * traffic — so the certificate can be ready and waiting before cutover.
     *
     * Kept on stack deletion: an in-use certificate cannot be deleted anyway,
     * and replacing one under a live distribution is never what was meant.
     */
    const certificate = new Certificate(this, 'Certificate', {
      domainName,
      subjectAlternativeNames: [aliasName],
      validation: CertificateValidation.fromDns(zone),
    });
    certificate.applyRemovalPolicy(RemovalPolicy.RETAIN);

    const assets = new Bucket(this, 'Assets', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      // Everything in it is build output and is re-uploaded by the next deploy.
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });
    // Readable only by this distribution, through origin access control.
    const assetsOrigin = S3BucketOrigin.withOriginAccessControl(assets);

    /**
     * The React Router server.
     *
     * Lambda@Edge functions cannot have environment variables, so the little
     * configuration the server needs is compiled into the bundle with esbuild's
     * `define`. None of it is secret. A secret would not belong here: it would
     * go in an SSM SecureString, with only its *path* defined below and the
     * value read at run time — never into a bundle, a template or `cdk.out`.
     */
    const server = new NodejsFunction(this, 'Server', {
      entry: join(ROOT, 'server/index.ts'),
      projectRoot: ROOT,
      depsLockFilePath: join(ROOT, 'package-lock.json'),
      description: `Renders ${domainName} (React Router)`,
      runtime: Runtime.NODEJS_24_X,
      memorySize: 1024,
      timeout: Duration.seconds(10),
      awsSdkConnectionReuse: false,
      // CloudFront needs hours to retire edge replicas after a version is
      // replaced. Retain old versions so stack cleanup does not try to delete
      // them while they are still replicated.
      currentVersionOptions: { removalPolicy: RemovalPolicy.RETAIN },
      bundling: {
        minify: true,
        define: {
          // Without this React loads its development build, which is several
          // times slower to render and larger to parse on a cold start.
          'process.env.NODE_ENV': JSON.stringify('production'),
          'process.env.CONTACT_TO_EMAIL': JSON.stringify(props.contactEmail),
          'process.env.CONTACT_FROM_EMAIL': JSON.stringify(props.contactEmail),
          'process.env.SES_REGION': JSON.stringify(this.region),
        },
      },
    });

    // Send mail as the one verified address, and nothing else. This function
    // is reachable from the public internet; `Resource: *` would let it send
    // as any identity in the account.
    server.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['ses:SendEmail'],
        resources: [
          this.formatArn({
            service: 'ses',
            resource: 'identity',
            resourceName: props.contactEmail,
          }),
        ],
        conditions: { StringEquals: { 'ses:FromAddress': props.contactEmail } },
      }),
    );

    /**
     * The cache key for rendered pages.
     *
     * Every TTL is zero except the ceiling, which hands the decision to the
     * server: a response is cached for as long as its own `Cache-Control`
     * says, and one that says `no-store` is not cached at all. The policy that
     * decides is `applyCacheControl` in `server/createRequestHandler.ts`.
     *
     * No cookies and no headers are in the key — nothing the site renders
     * depends on either — and only the query parameters the app reads are, so
     * a link decorated with tracking parameters is still a cache hit, and
     * nobody can force a render per request by appending random ones.
     */
    const pageCache = new CachePolicy(this, 'PageCache', {
      comment: `${domainName}: rendered pages, lifetime decided by the server`,
      minTtl: Duration.seconds(0),
      defaultTtl: Duration.seconds(0),
      maxTtl: Duration.days(365),
      cookieBehavior: CacheCookieBehavior.none(),
      headerBehavior: CacheHeaderBehavior.none(),
      queryStringBehavior: CacheQueryStringBehavior.allowList(...CACHED_QUERY_STRINGS),
      enableAcceptEncodingBrotli: true,
      enableAcceptEncodingGzip: true,
    });

    /**
     * Security headers on every response, static files included.
     *
     * Set here rather than by the server because the static behaviours never
     * reach it. No Content-Security-Policy: one strict enough to be worth
     * having needs a per-response nonce, which only the renderer can produce.
     */
    const securityHeaders = new ResponseHeadersPolicy(this, 'SecurityHeaders', {
      comment: `${domainName}: HSTS, MIME sniffing, framing and referrer policy`,
      securityHeadersBehavior: {
        // Not preloaded: the preload list is a one-way door.
        strictTransportSecurity: {
          accessControlMaxAge: Duration.days(730),
          includeSubdomains: true,
          preload: false,
          override: true,
        },
        contentTypeOptions: { override: true },
        frameOptions: { frameOption: HeadersFrameOption.DENY, override: true },
        referrerPolicy: {
          referrerPolicy: HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
          override: true,
        },
      },
    });

    const normalizeUrl = new CloudFrontFunction(this, 'NormalizeUrl', {
      comment: `${domainName}: canonical host and trailing slash`,
      runtime: FunctionRuntime.JS_2_0,
      code: FunctionCode.fromInline(viewerRequestSource(attachDomain ? domainName : undefined)),
    });

    const staticFiles: BehaviorOptions = {
      origin: assetsOrigin,
      cachePolicy: CachePolicy.CACHING_OPTIMIZED,
      compress: true,
      responseHeadersPolicy: securityHeaders,
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    };

    /*
     * Access logs. Read during an investigation and never otherwise, which is
     * why they go to S3 with an expiry rather than to CloudWatch, where every
     * line is billed on arrival. Ninety days: long enough for an incident
     * noticed late, short enough not to become an archive of who read what.
     */
    const accessLogs = new Bucket(this, 'AccessLogs', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      // CloudFront's standard logging delivers with an ACL.
      objectOwnership: ObjectOwnership.BUCKET_OWNER_PREFERRED,
      lifecycleRules: [{ id: 'expire', expiration: Duration.days(90) }],
      removalPolicy: RemovalPolicy.RETAIN,
    });

    const distribution = new Distribution(this, 'Distribution', {
      comment: domainName,
      domainNames: attachDomain ? [domainName, aliasName] : undefined,
      certificate: attachDomain ? certificate : undefined,
      httpVersion: HttpVersion.HTTP2_AND_3,
      // North America and Europe. Readers elsewhere are still served, from the
      // nearest of those; the other edge locations cost more per request.
      priceClass: PriceClass.PRICE_CLASS_100,
      enableLogging: true,
      logBucket: accessLogs,
      logFilePrefix: 'cloudfront/',
      defaultBehavior: {
        // Never actually reached: the function below answers every request.
        origin: assetsOrigin,
        allowedMethods: AllowedMethods.ALLOW_ALL,
        cachePolicy: pageCache,
        // The server needs the viewer's Host (for redirects and canonical
        // checks), Content-Type (for form posts) and Origin (CSRF checks).
        originRequestPolicy: OriginRequestPolicy.ALL_VIEWER,
        responseHeadersPolicy: securityHeaders,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        functionAssociations: [
          { eventType: FunctionEventType.VIEWER_REQUEST, function: normalizeUrl },
        ],
        edgeLambdas: [
          {
            eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
            functionVersion: server.currentVersion,
            includeBody: true,
          },
        ],
      },
      additionalBehaviors: Object.fromEntries(
        [...IMMUTABLE_PATHS, ...STATIC_PATHS].map((pattern) => [pattern, staticFiles]),
      ),
    });

    /*
     * Two deployments of the same directory, split by how long a browser may
     * keep the file. Each one's filters also scope what it prunes, so neither
     * deletes the other's objects.
     */
    new BucketDeployment(this, 'DeployImmutable', {
      destinationBucket: assets,
      sources: [Source.asset(CLIENT_BUILD)],
      exclude: ['*'],
      include: IMMUTABLE_PATHS,
      cacheControl: [CacheControl.fromString('public, max-age=31536000, immutable')],
      prune: true,
    });

    new BucketDeployment(this, 'DeployStatic', {
      destinationBucket: assets,
      sources: [Source.asset(CLIENT_BUILD)],
      exclude: IMMUTABLE_PATHS,
      // Stable names, so a short life: an hour in browsers, a day at the edge.
      cacheControl: [CacheControl.fromString('public, max-age=3600, s-maxage=86400')],
      prune: true,
      /*
       * Invalidating everything on each deploy is what lets rendered pages be
       * cached for a long time: the cache is emptied exactly when the content
       * changes. It also clears the static files above.
       */
      distribution,
      distributionPaths: ['/*'],
    });

    if (attachDomain) {
      const target = RecordTarget.fromAlias(new CloudFrontTarget(distribution));

      for (const [key, recordName] of [
        ['Apex', domainName],
        ['Www', aliasName],
      ] as const) {
        new ARecord(this, `${key}A`, { zone, recordName, target });
        new AaaaRecord(this, `${key}Aaaa`, { zone, recordName, target });
      }
    }

    new CfnOutput(this, 'DistributionDomainName', { value: distribution.distributionDomainName });
    new CfnOutput(this, 'DistributionId', { value: distribution.distributionId });
  }
}
