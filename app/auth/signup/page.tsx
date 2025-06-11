"use client";
import { auth } from "@/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { redirect } from "next/navigation";

import { useState } from "react";

export default  function page() {
  
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
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      
      <div>
       <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">Sign In</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Use your email and password to sign in
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 sm:px-16">
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="name"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          user name
        </Label>

        <Input
        onChange={handleChange}
          id="name"
          name="name"
          className="bg-muted text-md md:text-sm"
          type="name"
          placeholder="user"
          autoComplete="name"
          required
          autoFocus
          defaultValue={"name"}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="name"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          user name
        </Label>

        <Input
        onChange={handleChange}
          id="email"
          name="email"
          className="bg-muted text-md md:text-sm"
          type="email"
          placeholder="user@acme.com"
          autoComplete="email"
          required
          autoFocus
          defaultValue={"jojo@jojo.com"}
        />
      </div>


      <div className="flex flex-col gap-2">
        <Label
          htmlFor="password"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          Password
        </Label>

        <Input
          id="password"
          name="password"
          className="bg-muted text-md md:text-sm"
          type="password"
          required
          defaultValue={"pass123456789"}
onChange={handleChange}
        />
      </div>
      <button type="submit">Sign Up</button>

       <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            {'Already have an account? '}
            <Link
              href="/auth/sigin"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              Sign in
            </Link>
            {' instead.'}
          </p>
    </form>
        
      </div>
    </div>

      
    </div>
    </div>
  );
}