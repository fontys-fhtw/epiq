"use client";

import { supabase } from "@src/lib/supabaseClient";
import { useState } from "react";

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);

  const handleLogin = async () => {
    const { data, error } = await signIn(email, password);

    if (error) setErr(error.message);
    else console.info("Logged in:", data);
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="button" onClick={handleLogin}>
        Login
      </button>
      {err && <p>{err}</p>}
    </div>
  );
}
