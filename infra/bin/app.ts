#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { site } from '../../app/site.ts';
import { PipelineStack } from '../lib/pipeline-stack.ts';
import { WebsiteStack } from '../lib/website-stack.ts';

const app = new App();

/**
 * Reads a required value from the `context` block of `cdk.json`.
 *
 * Deployment settings live there, committed, rather than in `.env`: the
 * pipeline builds from a clean checkout and has no `.env`, so anything that
 * lived only on a laptop would silently read as unset on every CI deploy.
 * None of these values is a secret.
 */
const context = (key: string): string => {
  const value: unknown = app.node.tryGetContext(key);
  if (typeof value !== 'string' || value === '') {
    throw new Error(`cdk.json is missing the "${key}" context value`);
  }
  return value;
};

// CloudFront, its certificate and Lambda@Edge all have to live in us-east-1.
const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' };

/** The apex domain, taken from the site's canonical URL so the two cannot disagree. */
const domainName = new URL(site.url).host;

const website = new WebsiteStack(app, 'BuildInSaratovWebsite', {
  env,
  description: `${domainName}: React Router rendered at the edge behind CloudFront`,
  domainName,
  hostedZoneId: context('hostedZoneId'),
  /*
   * Whether the distribution answers on the real domain.
   *
   * `false` deploys everything except the DNS records and the domain names on
   * the distribution, so the site can be checked on its `*.cloudfront.net`
   * address while the old host is still live. Flip it to `true` in `cdk.json`
   * for the cutover — see the README, the order of the steps matters.
   */
  attachDomain: app.node.tryGetContext('attachDomain') === true,
  contactEmail: context('contactEmail'),
});

new PipelineStack(app, 'BuildInSaratovPipeline', {
  env,
  description: `${domainName}: builds and deploys the website on every push`,
  repository: context('sourceRepository'),
  branch: context('sourceBranch'),
  connectionParameter: context('githubConnectionParameter'),
  websiteStackName: website.stackName,
});
