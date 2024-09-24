"use client";

import { signIn } from "@src/queries/customer";
import createSupabaseBrowserClient from "@src/utils/supabase/browserClient";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const supabase = createSupabaseBrowserClient();

  const { isPending, isError, mutate } = useMutation({
    mutationFn: (credentials) => {
      return signIn(supabase, credentials);
    },
  });

  const handleSignIn = () => {
    mutate({ email, password });
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

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
      <button type="button" onClick={handleSignIn}>
        Login
      </button>
    </div>
  );
}
