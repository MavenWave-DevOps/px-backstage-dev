import { gcpCostPlugin } from './plugin';

describe('gcp-cost', () => {
  it('should export plugin', () => {
    expect(gcpCostPlugin).toBeDefined();
  });
});
