import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

async function main() {
  const octokit = await getUncachableGitHubClient();
  const token = await getAccessToken();
  
  // Get authenticated user
  const { data: user } = await octokit.users.getAuthenticated();
  const repoName = 'telugu-billing-app';
  
  console.log(`Pushing to: https://github.com/${user.login}/${repoName}`);
  
  // Update git remote to use token authentication
  execSync(`git remote remove origin || true`, { stdio: 'inherit' });
  execSync(`git remote add origin https://${user.login}:${token}@github.com/${user.login}/${repoName}.git`, { stdio: 'inherit' });
  
  console.log('Remote configured with authentication token');
  
  // Push to GitHub
  try {
    execSync('git push -u origin main', { stdio: 'inherit' });
    console.log('\n✅ Successfully pushed to GitHub!');
    console.log(`🔗 View your repository: https://github.com/${user.login}/${repoName}`);
  } catch (error) {
    console.error('Push failed:', error);
  }
}

main().catch(console.error);
