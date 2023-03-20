import React from 'react';
import { Navigate, Route } from 'react-router';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import {
  CatalogImportPage,
  catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import {
  CatalogGraphPage,
  catalogGraphPlugin,
} from '@backstage/plugin-catalog-graph';
import { orgPlugin } from '@backstage/plugin-org';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { SearchPage } from '@backstage/plugin-search';
import { TechRadarPage } from '@backstage/plugin-tech-radar';
import {
  TechDocsIndexPage,
  techdocsPlugin,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import {
  CostInsightsPage,
  CostInsightsProjectGrowthInstructionsPage,
  CostInsightsLabelDataflowInstructionsPage,
} from '@backstage/plugin-cost-insights';
import { GraphiQLPage } from '@backstage/plugin-graphiql';
import { darkTheme, lightTheme } from '@backstage/theme';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apis } from './apis';
import { createApp } from '@backstage/app-defaults';
import { entityPage } from './components/catalog/EntityPage';
// import { orgPlugin } from '@backstage/plugin-org';
import { searchPage } from './components/search/SearchPage';
import { Root } from './components/Root';

import { EntityMyPluginContent } from '@internal/plugin-my-plugin';

import { AlertDisplay, OAuthRequestDialog } from '@backstage/core-components';
// import { createApp } from '@backstage/app-defaults';
import { FlatRoutes } from '@backstage/core-app-api';
// import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';

import { githubAuthApiRef } from '@backstage/core-plugin-api';
import { googleAuthApiRef } from '@backstage/core-plugin-api';
import { SignInProviderConfig, SignInPage } from '@backstage/core-components';

const githubProvider: SignInProviderConfig = {
    id: 'github-auth-provider',
    title: 'GitHub',
    message: 'Sign in using Github',
    apiRef: githubAuthApiRef,
};

const googleProvider: SignInProviderConfig = {
    id: 'google-auth-provider',
    title: 'Google',
    message: 'Sign in using Google',
    apiRef: googleAuthApiRef,
};

const app = createApp({
  apis,
  components: {
    SignInPage: props => (
      <SignInPage
        {...props}
        auto
        providers={[
        // {
        //   id: 'github-auth-provider',
        //   title: 'GitHub',
        //   message: 'Sign in using GitHub',
        //   apiRef: githubAuthApiRef,
        // },
        // {
        //   id: 'google-auth-provider',
        //   title: 'Google',
        //   message: 'Sign in using Google',
        //   apiRef: googleAuthApiRef,
        // },
        "guest"]}
      />
    ),
  },
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
    });
    bind(apiDocsPlugin.externalRoutes, {
      registerApi: catalogImportPlugin.routes.importPage,
    });
    bind(scaffolderPlugin.externalRoutes, {
      registerComponent: catalogImportPlugin.routes.importPage,
    });
    bind(orgPlugin.externalRoutes, {
      catalogIndex: catalogPlugin.routes.catalogIndex,
    });
    bind(catalogGraphPlugin.externalRoutes, {
      catalogEntity: catalogPlugin.routes.catalogEntity,
    });
  },
  themes: [
    {
      id: 'light',
      title: 'Light',
      variant: 'light',
      Provider: ({ children }) => (
        <ThemeProvider theme={lightTheme}>
          <CssBaseline>{children}</CssBaseline>
        </ThemeProvider>
      ),
    },
    {
      id: 'dark',
      title: 'Dark',
      variant: 'dark',
      Provider: ({ children }) => (
        <ThemeProvider theme={darkTheme}>
          <CssBaseline>{children}</CssBaseline>
        </ThemeProvider>
      ),
    },
    // {
    //   id: 'aperture',
    //   title: 'Aperture',
    //   variant: 'light',
    //   Provider: ({ children }) => (
    //     <ThemeProvider theme={apertureTheme}>
    //       <CssBaseline>{children}</CssBaseline>
    //     </ThemeProvider>
    //   ),
    // },
  ],

  components: {
      // SignInPage: props => (
      //   <SignInPage
      //     {...props}
      //     auto
      //     provider={}// githubProvider, googleProvider}
      //   />
      // ),
    },
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();

const routes = (
  <FlatRoutes>
    <Route path="/" element={<Navigate to="catalog" />} />
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    <Route path="/cost-insights" element={<CostInsightsPage />} />
    <Route
      path="/cost-insights/investigating-growth"
      element={<CostInsightsProjectGrowthInstructionsPage />}
    />
    <Route
      path="/cost-insights/labeling-jobs"
      element={<CostInsightsLabelDataflowInstructionsPage />}
    />
    <Route path="/docs" element={<TechDocsIndexPage />} />
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    >
      <TechDocsAddons>
        <ReportIssue />
      </TechDocsAddons>
    </Route>
    <Route path="/graphiql" element={<GraphiQLPage />} />

    <Route path="/my-plugin" element={<EntityMyPluginContent />}/>

    <Route path="/create" element={<ScaffolderPage />} />
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route
      path="/tech-radar"
      element={<TechRadarPage width={1500} height={800} />}
    />
    <Route
      path="/catalog-import"
      element={
        <RequirePermission permission={catalogEntityCreatePermission}>
          <CatalogImportPage />
        </RequirePermission>
      }
    />
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />} />
    <Route path="/catalog-graph" element={<CatalogGraphPage />} />
    <Route path="/my-plugin" element={<EntityMyPluginContent />} />
  </FlatRoutes>
);

const App = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </AppProvider>
);

export default App;
