import axios from "axios";

async function getSuggestions() {
  const response = await axios.get("/api/customer/suggestions");
  return response.data; // Return the parsed response data
}

export { getSuggestions };
