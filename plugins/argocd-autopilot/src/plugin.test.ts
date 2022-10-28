import { argocdAutopilotPlugin } from './plugin';

describe('argocd-autopilot', () => {
  it('should export plugin', () => {
    expect(argocdAutopilotPlugin).toBeDefined();
  });
});
