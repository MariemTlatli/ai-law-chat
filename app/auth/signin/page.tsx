// /app/auth/signin/page.tsx
"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou mot de passe incorrect");
    } else {
      // Redirection dynamique selon le rôle
      const session = await fetch("/api/session").then(res => res.json());
      const role = session.user?.role;

      if (role === "admin") {
        router.push("/page2");
      } else {
        router.push("/page1");
      }

      router.refresh();
    }
  };

  return (
    <div>
      <h1>Se connecter</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" required />
        <br />
        <input name="password" type="password" placeholder="Mot de passe" required />
        <br />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}