import { Octokit } from '@octokit/rest'

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
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

export async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

async function main() {
  const octokit = await getUncachableGitHubClient();
  
  // Get authenticated user
  const { data: user } = await octokit.users.getAuthenticated();
  console.log('GitHub User:', user.login);
  
  // Create repository
  const repoName = 'telugu-billing-app';
  try {
    const { data: repo } = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      description: 'Telugu Voice-Enabled Billing Application for Shops',
      private: false,
      auto_init: false
    });
    console.log('Repository created:', repo.html_url);
    console.log('Git URL:', repo.clone_url);
    console.log('\nTo push your code, run:');
    console.log(`git remote add origin ${repo.clone_url}`);
    console.log('git add .');
    console.log('git commit -m "Initial commit: Telugu billing app"');
    console.log('git push -u origin main');
  } catch (error: any) {
    if (error.status === 422) {
      console.log('Repository already exists. Fetching details...');
      const { data: repo } = await octokit.repos.get({
        owner: user.login,
        repo: repoName
      });
      console.log('Repository URL:', repo.html_url);
      console.log('Git URL:', repo.clone_url);
      console.log('\nTo push your code, run:');
      console.log(`git remote set-url origin ${repo.clone_url} || git remote add origin ${repo.clone_url}`);
      console.log('git add .');
      console.log('git commit -m "Update: Telugu billing app"');
      console.log('git push -u origin main');
    } else {
      throw error;
    }
  }
}

main().catch(console.error);
