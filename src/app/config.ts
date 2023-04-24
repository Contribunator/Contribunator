export const githubConfig = {
  clientId: process.env.GITHUB_CLIENT_ID as string,
  clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  appId: parseInt(process.env.GITHUB_APP_ID as string),
  installationId: parseInt(process.env.GITHUB_APP_INSTALLATION_ID as string),
  privateKey: process.env.GITHUB_APP_PK as string,
};
