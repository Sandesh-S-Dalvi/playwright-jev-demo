import { expect as baseExpect } from "@playwright/test";
import { JevAutomationHelper, noul } from "./jev-client";

const jevHelper = new JevAutomationHelper();

export const expect = baseExpect.extend({
  async toSatisfySemanticCheck(
    locator: any,
    questionText: string,
    threshold = 0.85
  ) {
    const page = locator.page();
    const snapshot = await locator.ariaSnapshot();

    const { answers } = await jevHelper.evaluateSnapshot(
      { url: page.url(), snapshot },
      {
        semanticCheck: noul(questionText, {
          true: "The content matches the intent of the assertion",
          false: "The content does not match the intent of the assertion",
        }),
      }
    );

    const score = answers.semanticCheck.noul;
    const pass = score >= threshold;

    return {
      message: () =>
        `Expected element to satisfy semantic check: "${questionText}". Confidence: ${score} (threshold: ${threshold})`,
      pass,
    };
  },
});
