import { test } from "@playwright/test";
import { expect } from "../lib/custom-matchers";

test.describe("Custom Semantic Assertions with Jev", () => {
  test("verifies semantic greeting message regardless of exact phrasing", async ({ page }) => {
    await page.setContent(`
      <div id="welcome-banner">
        <h2>Good to see you again, Alex!</h2>
      </div>
    `);

    await expect(page.locator("#welcome-banner")).toSatisfySemanticCheck(
      "Is the user greeted with a welcoming message?"
    );
  });
});
