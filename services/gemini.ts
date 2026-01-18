
import { GoogleGenAI, Type } from "@google/genai";
import { WhopListing } from "../types";

const API_KEY = process.env.API_KEY || "";

export const scrapeWhopListing = async (query: string): Promise<WhopListing> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Perform an elite-level market intelligence extraction for this Whop.com product/hub: "${query}".
    
    You are a professional market analyst. Extract:
    1. Entity name, primary category, and the name of the creator/brand if available.
    2. Comprehensive pricing hierarchy (all available tiers).
    3. Precise description of the core value proposition.
    4. Top 8-10 features or digital assets provided.
    5. A 1-10 sentiment score based on public perception.
    6. A detailed sentiment breakdown (1-100) for: Value for Money, Quality, Customer Support, and Ease of Use.
    7. 3-4 specific competitors on Whop or similar hubs, their pricing, and the unique competitive advantage of THIS product.
    8. Strategic growth potential analysis (market size, trends).
    9. Assign a 'Confidence Score' (0-100) based on the clarity and quantity of data found.

    Return the result as a strict JSON object following the requested schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            creator: { type: Type.STRING },
            category: { type: Type.STRING },
            plans: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                  currency: { type: Type.STRING },
                  cycle: { type: Type.STRING },
                },
                required: ["name", "price", "currency", "cycle"]
              }
            },
            description: { type: Type.STRING },
            features: { type: Type.ARRAY, items: { type: Type.STRING } },
            sentimentScore: { type: Type.NUMBER },
            sentimentBreakdown: {
              type: Type.OBJECT,
              properties: {
                valueForMoney: { type: Type.NUMBER },
                quality: { type: Type.NUMBER },
                support: { type: Type.NUMBER },
                easeOfUse: { type: Type.NUMBER },
              },
              required: ["valueForMoney", "quality", "support", "easeOfUse"]
            },
            competitors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  priceRange: { type: Type.STRING },
                  advantage: { type: Type.STRING },
                },
                required: ["name", "priceRange", "advantage"]
              }
            },
            growthPotential: { type: Type.STRING },
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidenceScore: { type: Type.NUMBER },
          },
          required: ["name", "category", "plans", "description", "features", "sentimentScore", "sentimentBreakdown", "competitors", "growthPotential", "confidenceScore"]
        }
      },
    });

    const resultText = response.text;
    const parsedData = JSON.parse(resultText);
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }));

    return {
      ...parsedData,
      id: Math.random().toString(36).substring(7),
      url: query.startsWith('http') ? query : `Search: ${query}`,
      extractedAt: new Date().toISOString(),
      sources: sources
    };
  } catch (error) {
    console.error("Scraping failed:", error);
    throw new Error("Intelligence engine encountered a data block. Please try a different product name.");
  }
};
