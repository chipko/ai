import fs from 'node:fs';
import path from 'node:path';
import { expect, test as setup } from '@playwright/test';
import { authFile, loadConfig, resultsFile } from '../lib/config';
import { fillField, locate } from '../lib/fields';

const config = loadConfig();

setup('prepare run (log in once, reset results)', async ({ page }) => {
  fs.mkdirSync(path.dirname(resultsFile), { recursive: true });
  fs.writeFileSync(resultsFile, 'id,line,status,reference,error\n');
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  if (!config.login) {
    fs.writeFileSync(authFile, JSON.stringify({ cookies: [], origins: [] }));
    return;
  }
  await page.goto(config.login.path);
  for (const field of config.login.fields) await fillField(page, field, undefined, config);
  await locate(page, config.login.submit).click();
  await expect(locate(page, config.login.success)).toBeVisible({ timeout: 30_000 });
  await page.context().storageState({ path: authFile });
});
