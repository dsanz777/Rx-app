"use client";

import { FormEvent, useMemo, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const initialMessages: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "Ready to translate today’s intel into bedside-friendly talking points. Ask about a drug, policy ripple, or operational scenario whenever you’re ready.",
  },
];

export function AiPharmacistChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim() || isSending) return;

    const newUserMessage: ChatMessage = { role: "user", content: input.trim() };
    const nextMessages = [...messages, newUserMessage];

    setMessages(nextMessages);
    setInput("");
    setIsSending(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const data = (await response.json()) as { reply?: string };
      const replyContent = data.reply?.trim();

      if (!replyContent) {
        throw new Error("Empty reply");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: replyContent }]);
    } catch (err) {
      console.error(err);
      setError("ChatGPT is unavailable right now. Try again in a moment.");
    } finally {
      setIsSending(false);
    }
  };

  const transcript = useMemo(
    () =>
      messages.map((message, index) => (
        <div key={`${message.role}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            {message.role === "assistant" ? "Rx Chat" : "You"}
          </p>
          <p className="mt-2 text-sm text-white/80">{message.content}</p>
        </div>
      )),
    [messages],
  );

  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">AI pharmacist chat</p>
        <p className="text-[10px] uppercase text-white/30">Not medical advice</p>
      </div>

      <div className="mt-4 flex h-60 flex-col gap-3 overflow-y-auto rounded-2xl border border-white/10 bg-black/30 p-4">
        {transcript}
        {isSending && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-sm text-white/60">
            Drafting response…
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <label className="flex items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/70">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about a med, payer move, or ops scenario"
            className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
          />
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
            {isSending ? "Sending" : "Enter"}
          </span>
        </label>
        <button
          type="submit"
          disabled={isSending || !input.trim()}
          className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Send
        </button>
        {error && <p className="text-xs text-red-300">{error}</p>}
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
          Always verify against patient-specific data.
        </p>
      </form>
    </div>
  );
}
