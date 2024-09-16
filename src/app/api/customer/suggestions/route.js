import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Is working but needs money to run
    // const chatbotResponse = await generateSuggestions();

    // NOTE: This is a placeholder for the actual API call
    const chatbotResponse = "This is a placeholder response";

    return NextResponse.json({ chatbotResponse });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
