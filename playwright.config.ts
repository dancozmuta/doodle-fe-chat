import { defineConfig } from '@playwright/test';
import os from 'os';

// In some sandboxed environments, `os.cpus()` can be empty, which makes Playwright
// mis-detect Apple Silicon as "mac-x64". When that happens, force the correct
// host platform so the installed arm64 browsers are used.
if (process.platform === 'darwin' && process.arch === 'arm64' && os.cpus().length === 0) {
  const [majorStr] = os.release().split('.');
  const major = Number.parseInt(majorStr ?? '0', 10);
  const LAST_STABLE_MACOS_MAJOR_VERSION = 15;
  const macVersion = 'mac' + Math.min(major - 9, LAST_STABLE_MACOS_MAJOR_VERSION);
  process.env.PLAYWRIGHT_HOST_PLATFORM_OVERRIDE = `${macVersion}-arm64`;
}

export default defineConfig({
  testDir: './e2e',
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    },
  },
  use: {
    baseURL: 'http://127.0.0.1:4201',
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: 'npm run start -- --port 4201 --host 127.0.0.1',
    url: 'http://127.0.0.1:4201',
    reuseExistingServer: true,
  },
});

