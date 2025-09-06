
import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is available in the environment.
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey });

export async function reviewCode(code: string, language: string): Promise<string> {
  const prompt = `
    Act as an expert code reviewer. Analyze the following ${language} code and provide a comprehensive review.
    Focus on the following aspects:
    1.  **Bugs and Errors:** Identify any potential bugs, logic errors, or edge cases that might have been missed.
    2.  **Best Practices & Readability:** Suggest improvements for code style, clarity, and maintainability. Mention adherence to common conventions for ${language}.
    3.  **Performance:** Point out any potential performance bottlenecks and suggest optimizations.
    4.  **Security:** Highlight any potential security vulnerabilities (e.g., SQL injection, XSS, etc., if applicable).
    5.  **Refactoring Suggestions:** Provide concrete examples of how the code could be refactored for better structure or efficiency.

    Provide your feedback in Markdown format. Use headings, bullet points, and code blocks for clarity.

    Here is the code to review:
    \`\`\`${language.toLowerCase()}
    ${code}
    \`\`\`
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `Error during code review: ${error.message}`;
    }
    return "An unknown error occurred during code review.";
  }
}
