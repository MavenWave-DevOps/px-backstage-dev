import React, { PropsWithChildren } from 'react';
import { Link, makeStyles } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import ExtensionIcon from '@material-ui/icons/Extension';
import MapIcon from '@material-ui/icons/MyLocation';
import MoneyIcon from '@material-ui/icons/Money';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import { NavLink } from 'react-router-dom';
import { GraphiQLIcon } from '@backstage/plugin-graphiql';
import {
  Settings as SidebarSettings,
  UserSettingsSignInAvatar,
} from '@backstage/plugin-user-settings';
import { SidebarSearchModal } from '@backstage/plugin-search';
import {
  Sidebar,
  sidebarConfig,
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarPage,
  SidebarScrollWrapper,
  SidebarSpace,
  useSidebarOpenState,
} from '@backstage/core-components';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { appThemeApiRef, useApi } from '@backstage/core-plugin-api';
import { ApertureLogoFull } from './ApertureLogoFull';
import { ApertureLogoIcon } from './ApertureLogoIcon';
import { BackstageTheme } from '@backstage/theme';

const useSidebarLogoStyles = makeStyles<BackstageTheme, { themeId: string }>({
  root: {
    width: sidebarConfig.drawerWidthClosed,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
  },
  link: {
    width: sidebarConfig.drawerWidthClosed,
    marginLeft: 24,
  },
});

const SidebarLogo = () => {
  const { isOpen } = useSidebarOpenState();
  const appThemeApi = useApi(appThemeApiRef);
  const themeId = appThemeApi.getActiveThemeId();
  const classes = useSidebarLogoStyles({ themeId: themeId! });

  const fullLogo = themeId === 'aperture' ? <ApertureLogoFull /> : <LogoFull />;
  const iconLogo = themeId === 'aperture' ? <ApertureLogoIcon /> : <LogoIcon />;

  return (
    <div className={classes.root}>
      <Link
        component={NavLink}
        to="/"
        underline="none"
        className={classes.link}
        aria-label="Home"
      >
        {isOpen ? fullLogo : iconLogo}
      </Link>
    </div>
  );
};

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />
      <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
        <SidebarSearchModal />
      </SidebarGroup>
      <SidebarDivider />
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        {/* Global nav, not org-specific */}
        <SidebarItem icon={HomeIcon} to="catalog" text="Home" />
        <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
        <SidebarItem icon={LibraryBooks} to="docs" text="Docs" />
        <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />
        {/* End global nav */}
        <SidebarDivider />
        <SidebarScrollWrapper>
          <SidebarItem icon={MapIcon} to="tech-radar" text="Tech Radar" />
        </SidebarScrollWrapper>
      </SidebarGroup>
      <SidebarDivider />
      <SidebarItem icon={MapIcon} to="tech-radar" text="Tech Radar" />
      <SidebarItem icon={MoneyIcon} to="cost-insights" text="Cost Insights" />
      <SidebarItem icon={GraphiQLIcon} to="graphiql" text="GraphiQL" />
      <SidebarSpace />
      <SidebarDivider />
      <SidebarGroup
        label="Settings"
        icon={<UserSettingsSignInAvatar />}
        to="/settings"
      >
        <SidebarSettings />
      </SidebarGroup>
    </Sidebar>
    {children}
  </SidebarPage>
);
