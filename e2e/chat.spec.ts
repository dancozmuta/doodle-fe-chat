import { expect, test } from '@playwright/test';

test('Open app → type message → click send → message appears', async ({ page }) => {
  // Mock the chat API (including CORS + preflight) so the test is stable and offline.
  await page.route('**/api/v1/messages**', async (route) => {
    const request = route.request();
    const method = request.method();

    const corsHeaders = {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET,POST,OPTIONS',
      'access-control-allow-headers': 'authorization,content-type',
    };

    if (method === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: corsHeaders });
      return;
    }

    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: corsHeaders,
        body: JSON.stringify([]),
      });
      return;
    }

    if (method === 'POST') {
      const payload = request.postDataJSON() as { message: string; author: string };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: corsHeaders,
        body: JSON.stringify({
          _id: 'e2e-1',
          message: payload.message,
          author: payload.author,
          createdAt: new Date('2020-01-01T00:00:00.000Z').toISOString(),
        }),
      });
      return;
    }

    await route.fallback();
  });

  await page.goto('/');

  const messageInput = page.getByRole('textbox', { name: /message input/i });
  const sendButton = page.getByRole('button', { name: /send/i });

  await expect(sendButton).toBeDisabled();

  await messageInput.fill('Hello from E2E');
  await expect(sendButton).toBeEnabled();

  await sendButton.click();

  await expect(page.getByText('Hello from E2E')).toBeVisible();

  // Visual regression: verify the chat layout after sending a message.
  // Scoped to the chat wrapper to avoid capturing browser chrome.
  await expect(page.locator('.chat-wrapper')).toHaveScreenshot('chat-after-send.png');
});
