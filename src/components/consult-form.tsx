"use client";

import { FormEvent, useState } from "react";

export function ConsultForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setEmail("");
    setTopic("");
    setMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setError(null);

    try {
      const response = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Unable to send");
      }

      setStatus("success");
      resetForm();
    } catch (err) {
      console.error(err);
      setError((err as Error).message ?? "Unable to send request");
      setStatus("error");
    } finally {
      setTimeout(() => {
        setStatus("idle");
        setError(null);
      }, 4000);
    }
  };

  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">Consult form</p>
        <p className="text-[10px] uppercase text-white/30">Direct to Derek</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-4 text-sm">
        <label className="flex flex-col gap-1 text-white/80">
          <span className="text-xs uppercase tracking-wide text-white/40">Name</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
            placeholder="Full name"
          />
        </label>
        <label className="flex flex-col gap-1 text-white/80">
          <span className="text-xs uppercase tracking-wide text-white/40">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
            placeholder="contact@domain.com"
          />
        </label>
        <label className="flex flex-col gap-1 text-white/80">
          <span className="text-xs uppercase tracking-wide text-white/40">Topic</span>
          <input
            type="text"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
            placeholder="GLP-1 consult / FFS→VBC"
          />
        </label>
        <label className="flex flex-col gap-1 text-white/80">
          <span className="text-xs uppercase tracking-wide text-white/40">Message</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
            rows={4}
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
            placeholder="What do you need?"
          />
        </label>
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "Sending" : "Send request"}
        </button>
        {status === "success" && (
          <p className="text-xs text-green-300">Sent. Derek gets a copy at dereksanz@gmail.com.</p>
        )}
        {status === "error" && <p className="text-xs text-red-300">{error}</p>}
      </form>
    </div>
  );
}
