import { TypeSafeClient, choice, noul, score } from "@typesafe-ai/sdk";

const apiKey = process.env.TYPESAFE_API_KEY;

export class JevAutomationHelper {
  private client: TypeSafeClient | null = null;

  constructor() {
    if (apiKey) {
      this.client = new TypeSafeClient({
        apiKey,
        defaultModel: "jev-1.14.0", // pin for threshold stability
      });
    }
  }

  /**
   * Evaluate one or more typed questions against a compact page state.
   * Falls back to a deterministic local mock when no API key is present.
   */
  async evaluateSnapshot(
    state: { url: string; snapshot: string },
    questions: Record<string, any>
  ) {
    if (this.client) {
      return await this.client.systemOne({
        state,
        questions,
      });
    }

    // Offline / educational mock
    console.log("[Jev Mock Mode]: Evaluating snapshot locally...");
    const mockAnswers: Record<string, any> = {};

    for (const [key, q] of Object.entries(questions)) {
      if (q.type === "noul") {
        const isPositive =
          state.snapshot.includes("Profile") ||
          state.snapshot.includes("Logout") ||
          state.snapshot.includes("Sign Out") ||
          state.url.includes("profile");
        mockAnswers[key] = { noul: isPositive ? 0.96 : 0.04 };
      } else if (q.type === "choice") {
        if (state.snapshot.includes("Profile") || state.url.includes("profile")) {
          mockAnswers[key] = { choice: "profile" };
        } else if (state.snapshot.includes("Sign in") || state.snapshot.includes("Email")) {
          mockAnswers[key] = { choice: "login" };
        } else {
          mockAnswers[key] = { choice: "error" };
        }
      } else if (q.type === "score") {
        mockAnswers[key] = { score: 3 };
      }
    }

    return { answers: mockAnswers };
  }
}

export { choice, noul, score };
