# Azure AD & ADO Documentation
Steps to configure OAuth applications and Integrations with Azure AD
## Setup oauth application Azure AD
- Use (this)[https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/RegisteredApps] link for registering app
- New Registration
- Select Multi-tenant
- Web platform use this url for local development: `http://localhost:7007/api/auth/microsoft/handler/frame`

## Generate Secret Values Azure AD
- `AUTH_MICROSOFT_CLIENT_ID`
  - From application in Azure AD called Application (client) ID
- `AUTH_MICROSOFT_CLIENT_SECRET`
  - Certificates & Secrets tab
  - Add new secret
- `AUTH_MICROSOFT_TENANT_ID`
  - From application in Azure AD called Directory (tenant) ID

## Grant Access
- Backstage needs permissions to read the user and group data from Azure AD this is done by granting these permissions:
  - Navigate to `API Permissions` tab
  - `Add a permission`
  - `APIs my organization uses`
  - `Microsoft Graph`
  - `Application Permissions`
  - Search and add these values:
    - `User.Read.All`
    - `GroupMember.Read.All`
  - `Grant admin consent for Default Directory`

## Generate Secret Values Azure DevOps:
- `AZURE_TOKEN`
  - Create a Personal Access token (here)[https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=Windows]

## Create Secrets in GCP (Secret Manager)
- Create a secret per above naming

## Author
- @fosterm-mw

