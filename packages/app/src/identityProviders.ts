import {
  googleAuthApiRef,
  oktaAuthApiRef,
  githubAuthApiRef,
  microsoftAuthApiRef,

} from '@backstage/core-plugin-api';

export const providers = [
  {
    id: 'google-auth-provider',
    title: 'Google',
    message: 'Sign In using Google',
    apiRef: googleAuthApiRef,
  },
  {
    id: 'microsoft-auth-provider',
    title: 'Microsoft',
    message: 'Sign In using Microsoft Azure AD',
    apiRef: microsoftAuthApiRef,
  },
  
  {
    id: 'github-auth-provider',
    title: 'GitHub',
    message: 'Sign In using GitHub',
    apiRef: githubAuthApiRef,
  },
  {
    id: 'okta-auth-provider',
    title: 'Okta',
    message: 'Sign In using Okta',
    apiRef: oktaAuthApiRef,
  },
];
