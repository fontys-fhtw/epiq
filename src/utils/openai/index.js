import { OpenAI } from "openai";

const openai = new OpenAI();

async function generateSuggestions() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: "Write a haiku about recursion in programming.",
        },
      ],
    });

    return completion.choices[0].message;
  } catch (error) {
    throw new Error(error.message);
  }
}

export default generateSuggestions;
