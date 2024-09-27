import { ENV_VARS } from "@src/constants";
import { OpenAI } from "openai";

// This functionality will be moved to the server to avoid exposing the API key
const openai = new OpenAI({
  apiKey: ENV_VARS.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function generatePrompt(menu, orderHistory) {
  const pastOrders = orderHistory
    .map((order) => `${order.dish} from ${order.restaurant}`)
    .join(", ");
  const availableDishes = menu
    .map((dish) => `${dish.name}: ${dish.description}`)
    .join("\n");

  return `
    The user has previously ordered the following dishes: ${pastOrders}.
    Based on their past orders, suggest some dishes from the current restaurant menu below:

    ${availableDishes}
  `;
}

export async function generateSuggestions(restaurantMenu, userOrderHistory) {
  try {
    const prompt = generatePrompt(restaurantMenu, userOrderHistory);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    throw new Error(error.message);
  }
}
