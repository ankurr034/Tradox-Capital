import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `
You are the official AI Financial Assistant for Laal Street, an institutional-grade wealth management and trading platform.
Your job is to provide sharp, professional, and highly accurate answers to the user's questions regarding trading, the stock market, investing, and navigating the platform.
Do not provide explicit financial advice that guarantees returns. Maintain a highly professional, "FinTech terminal" tone (concise, data-driven, slightly robotic).

Key platform features you should know about:
- The user can trade on the /portfolio tab.
- KYC is required for trading.
- The platform uses a Kautilya Risk Engine for portfolio forecasting.
`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        success: true, 
        response: "[SYSTEM ERROR]: GEMINI_API_KEY is missing from the environment variables. The AI engine is currently offline. Please add your API key to the .env file to enable the Large Language Model." 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Using gemini-2.5-flash as the standard fast model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT
    });

    const result = await model.generateContent(message);
    const responseText = result.response.text();

    return NextResponse.json({ 
      success: true, 
      response: responseText
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
