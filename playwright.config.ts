import { PlaywrightTestConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env.test") });

// Use process.env.PORT by default and fallback to port 3000
const PORT = process.env.PORT || 3000;

// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
const baseURL = `http://localhost:${PORT}`;

// Reference: https://playwright.dev/docs/test-configuration
const config: PlaywrightTestConfig = {
  // Timeout per test
  timeout: 30 * 1000,
  expect: {
    timeout: 500,
  },
  // Test directory
  testDir: path.join(__dirname, "test/e2e"),
  // snapshots
  snapshotDir: path.join(__dirname, "snapshots"),
  snapshotPathTemplate: "{snapshotDir}/{testName}/{arg}{ext}",
  // If a test fails, retry it additional 2 times
  retries: 2,
  // Artifacts folder where screenshots, videos, and traces are stored.
  outputDir: path.join(__dirname, "test/results"),

  // Run your local dev server before starting the tests:
  // https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests
  webServer: {
    // TODO option to build the app instead of dev server
    command: "npm run dev:e2e",
    url: baseURL,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },

  use: {
    // Use baseURL so to make navigations relative.
    // More information: https://playwright.dev/docs/api/class-testoptions#test-options-base-url
    baseURL,

    // Retry a test if its failing with enabled tracing. This allows you to analyse the DOM, console logs, network traffic etc.
    // More information: https://playwright.dev/docs/trace-viewer
    trace: "retry-with-trace",

    // All available context options: https://playwright.dev/docs/api/class-browser#browser-new-context
    // contextOptions: {
    //   ignoreHTTPSErrors: true,
    // },
  },

  projects: [
    {
      name: "chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 640, height: 640 },
      },
    },
  ],
};

export default config;
