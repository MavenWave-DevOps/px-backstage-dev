import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { gcpCostPlugin, GcpCostPage } from '../src/plugin';

createDevApp()
  .registerPlugin(gcpCostPlugin)
  .addPage({
    element: <GcpCostPage />,
    title: 'Root Page',
    path: '/gcp-cost'
  })
  .render();
