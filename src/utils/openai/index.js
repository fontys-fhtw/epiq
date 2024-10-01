import { OpenAI } from "openai";

// This functionality will be moved to the server to avoid exposing the API key
const openai = new OpenAI();

const generatePrompt = (orderHistory, menuDishes) => {
  // Create a comma-separated list of dish names from the user's order history
  const orderHistoryString = orderHistory.join(", ");

  // Create a string of available dishes with IDs from the current restaurant menu
  const menuDishesString = Object.entries(menuDishes)
    .map(([id, dish]) => `${dish} (ID: ${id})`)
    .join(", ");

  // Generate the concise prompt
  const prompt = `Based on the user's past orders: ${orderHistoryString}, recommend up to 3 dishes from the available menu: ${menuDishesString}. Respond only with an array of dish IDs.`;

  return prompt;
};

// Function to convert the GPT response (string) into an array of dish IDs
const convertStringToArray = (responseString) => {
  // Assuming GPT's response is a string like '[1, 2, 3]'
  const arrayOfIds = responseString
    .replace(/[[\]]/g, "") // Remove brackets
    .split(",") // Split by comma
    .map((id) => parseInt(id.trim(), 10)); // Convert each string ID to an integer
  return arrayOfIds;
};

export async function generateSuggestions(orderHistory, menuDishes) {
  try {
    const prompt = generatePrompt(orderHistory, menuDishes);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });

    return convertStringToArray(completion.choices[0].message.content);
  } catch (error) {
    throw new Error(error.message);
  }
}
