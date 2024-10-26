import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

// eslint-disable-next-line consistent-return
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { date, time, numberOfPeople } = req.body;

    const { data, error } = await supabase
      .from("reservations")
      .insert([{ date, time, numberOfPeople }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: "Reservation created successfully", data });
  } else if (req.method === "GET") {
    // Recupera todas as reservas do banco
    const { data, error } = await supabase.from("reservations").select("*");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
