import { test, expect } from "@playwright/test";
import { JevAutomationHelper, noul, choice } from "../lib/jev-client";

const jev = new JevAutomationHelper();

test.describe("Login Automated Flow with Jev Assertions", () => {
  test("user logs in successfully and Jev verifies profile state", async ({ page }) => {
    await page.route("**/login", async (route) => {
      await route.fulfill({
        contentType: "text/html",
        body: `
          <html>
            <body>
              <h1>Store Login</h1>
              <label for="email">Email</label>
              <input id="email" type="email"/>
              <label for="password">Password</label>
              <input id="password" type="password"/>
              <button id="submit">Sign In</button>
            </body>
          </html>`,
      });
    });

    await page.route("**/profile", async (route) => {
      await route.fulfill({
        contentType: "text/html",
        body: `
          <html>
            <body>
              <main>
                <h1>User Account Profile</h1>
                <p>Welcome back, valued shopper!</p>
                <button>Sign Out</button>
              </main>
            </body>
          </html>`,
      });
    });

    await page.goto("http://localhost:3000/login");
    await page.getByLabel("Email").fill("customer@example.com");
    await page.getByLabel("Password").fill("Secret123!");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.goto("http://localhost:3000/profile");

    await expect(page).toHaveURL(/profile/);

    const mainSnapshot = await page.getByRole("main").ariaSnapshot();

    const { answers } = await jev.evaluateSnapshot(
      { url: page.url(), snapshot: mainSnapshot },
      {
        isSignedIn: noul("Is a signed-in user's profile displayed on this page?", {
          true: "Profile details are visible with a sign-out mechanism",
          false: "Login inputs or error messages are visible",
        }),
        pageCategory: choice("What type of page state is this?", {
          profile: "User account or dashboard screen",
          login: "Form requesting authentication credentials",
          error: "Error or access denied screen",
        }),
      }
    );

    expect(answers.isSignedIn.noul).toBeGreaterThan(0.9);
    expect(answers.pageCategory.choice).toBe("profile");
  });
});
