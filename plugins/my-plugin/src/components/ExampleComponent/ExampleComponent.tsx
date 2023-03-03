import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';

export const ExampleComponent = () => {
  const { entity } = useEntity();
  return <div>Hello {entity.metadata.name}</div>;
};
