
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || "";

export const enrichCompanyData = async (companyName: string) => {
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide professional company details for: ${companyName}. 
      1. website: Full URL (https://...)
      2. domain: Clean root domain (e.g., google.com)
      3. linkedin: Company LinkedIn URL
      4. emailStatus: 'Found' or 'Not Met' based on your knowledge of their public presence.
      Return as valid JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            website: { type: Type.STRING },
            domain: { type: Type.STRING },
            linkedin: { type: Type.STRING },
            emailStatus: { 
              type: Type.STRING,
              description: "Choose one: 'Found', 'Not Met'"
            }
          },
          required: ["website", "domain", "linkedin", "emailStatus"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Enrichment Error:", error);
    return null;
  }
};
