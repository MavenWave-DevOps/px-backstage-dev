import React from 'react';
import { Entity } from '@backstage/catalog-model';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { createDevApp } from '@backstage/dev-utils';
import { myPluginPlugin, EntityMyPluginContent } from '../src/plugin';

const mockEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Compnent',
  metadata: {
    name: 'backstage',
    description: 'backstage.io',
    annotations: {
      'backstage.io/kubernetes-id': 'dice-roller',
    },
  },
  spec: {
    lifecycle: 'production',
    type: 'service',
    owner: 'user:guest',
  },
};

createDevApp()
  .registerPlugin(myPluginPlugin)
  .addPage({
    path: '/fixture-1',
    title: 'Fixture 1',
    element: (
      <EntityProvider entity={mockEntity}>
        <EntityMyPluginContent />
      </EntityProvider>
    ),
  })
  .render();

