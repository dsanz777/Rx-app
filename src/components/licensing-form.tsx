"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function LicensingForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [estimatedUsers, setEstimatedUsers] = useState("");
  const [timeline, setTimeline] = useState("");
  const [goals, setGoals] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setError(null);

    try {
      const response = await fetch("/api/licensing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          role,
          organizationType,
          estimatedUsers,
          timeline,
          goals,
          website,
          source: "/pricing",
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Unable to send request");
      }

      setStatus("sent");
      setName("");
      setEmail("");
      setCompany("");
      setRole("");
      setOrganizationType("");
      setEstimatedUsers("");
      setTimeline("");
      setGoals("");
      setWebsite("");
    } catch (err) {
      setStatus("error");
      setError((err as Error).message ?? "Unable to send request");
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4 text-sm">
      <label className="flex flex-col gap-1 text-white/80">
        <span className="text-xs uppercase tracking-wide text-white/40">Name</span>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
          placeholder="Full name"
        />
      </label>

      <label className="flex flex-col gap-1 text-white/80">
        <span className="text-xs uppercase tracking-wide text-white/40">Work email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
          placeholder="name@company.com"
        />
      </label>

      <label className="flex flex-col gap-1 text-white/80">
        <span className="text-xs uppercase tracking-wide text-white/40">Company</span>
        <input
          type="text"
          required
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
          placeholder="Organization name"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-white/80">
          <span className="text-xs uppercase tracking-wide text-white/40">Role</span>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
            placeholder="CMO, VP, Director..."
          />
        </label>
        <label className="flex flex-col gap-1 text-white/80">
          <span className="text-xs uppercase tracking-wide text-white/40">Organization type</span>
          <input
            type="text"
            value={organizationType}
            onChange={(e) => setOrganizationType(e.target.value)}
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
            placeholder="Practice, payer, digital health..."
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-white/80">
          <span className="text-xs uppercase tracking-wide text-white/40">Estimated users</span>
          <input
            type="text"
            value={estimatedUsers}
            onChange={(e) => setEstimatedUsers(e.target.value)}
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
            placeholder="25, 100, 500..."
          />
        </label>
        <label className="flex flex-col gap-1 text-white/80">
          <span className="text-xs uppercase tracking-wide text-white/40">Timeline</span>
          <input
            type="text"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
            placeholder="This quarter, 6 months..."
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-white/80">
        <span className="text-xs uppercase tracking-wide text-white/40">Goals</span>
        <textarea
          required
          rows={5}
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
          placeholder="What outcomes are you trying to achieve with licensing?"
        />
      </label>

      <label className="hidden" aria-hidden="true">
        Website
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Submitting..." : "Request licensing discussion"}
      </button>

      {status === "sent" ? (
        <p className="text-xs text-green-300">Submitted. We will contact you at your work email.</p>
      ) : null}
      {status === "error" && error ? <p className="text-xs text-red-300">{error}</p> : null}
    </form>
  );
}
