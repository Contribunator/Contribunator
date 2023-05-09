const env = {
  clientId: process.env.GITHUB_APP_CLIENT_ID as string,
  clinetSecret: process.env.GITHUB_APP_CLIENT_SECRET as string,
  appId: parseInt(process.env.GITHUB_APP_ID as string),
  installationId: parseInt(process.env.GITHUB_APP_INSTALLATION_ID as string),
  privateKey: process.env.GITHUB_APP_PK as string,
};

Object.entries(env).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing env var ${key}`);
  }
});

export const clientId = env.clientId;
export const clientSecret = env.clinetSecret;
export const appId = env.appId;
export const installationId = env.installationId;
export const privateKey = env.privateKey;
