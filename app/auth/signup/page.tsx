// app/signup/page.tsx
"use client";
import { useState } from "react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Une erreur s'est produite");
    } else {
      setSuccess("Inscription réussie !");
      setFormData({ email: "", password: "", name: "" });
    }
  };

  return (
    <div>
      <h1>Inscription</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Nom" value={formData.name} onChange={handleChange} required />
        <br />
        <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} required />
        <br />
        <input name="password" placeholder="Mot de passe" type="password" value={formData.password} onChange={handleChange} required />
        <br />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}