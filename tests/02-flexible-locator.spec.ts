import { test, expect } from "@playwright/test";
import { JevAutomationHelper, choice } from "../lib/jev-client";

const jev = new JevAutomationHelper();

test.describe("Jev Flexible Element Selection", () => {
  test("finds the primary action button even when text changes", async ({ page }) => {
    await page.setContent(`
      <form>
        <h2>Checkout</h2>
        <button id="btn-cancel">Abort</button>
        <button id="btn-submit">Proceed to Payment & Purchase</button>
      </form>
    `);

    const formSnapshot = await page.locator("form").ariaSnapshot();

    const { answers } = await jev.evaluateSnapshot(
      { url: page.url(), snapshot: formSnapshot },
      {
        targetButton: choice("Which button completes the checkout process?", {
          "Proceed to Payment & Purchase": "Button that advances payment",
          Abort: "Button that cancels the operation",
        }),
      }
    );

    const selectedButtonText = answers.targetButton.choice;

    await page.getByRole("button", { name: selectedButtonText }).click();
    console.log(`Successfully clicked dynamically identified button: "${selectedButtonText}"`);
  });
});
