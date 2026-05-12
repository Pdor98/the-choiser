"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ChatGptCopyPanelProps = {
  content: string;
};

export function ChatGptCopyPanel({ content }: ChatGptCopyPanelProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 2200);
  }

  return (
    <div className="space-y-8 pb-10">
      <section className="relative isolate overflow-hidden rounded-[36px] border border-white/8 bg-[#0a0a0a] px-5 py-16 shadow-[0_30px_90px_-56px_rgba(15,23,42,0.9)] sm:px-8 sm:py-20 lg:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(18,44,84,0.42),transparent_36%),radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_60%),linear-gradient(180deg,rgba(10,10,10,0.22),rgba(10,10,10,0.82))]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.36em] text-slate-400 sm:text-xs">
            ChatGPT · Handoff
          </p>
          <h1 className="font-heading mx-auto mt-6 max-w-4xl text-balance text-[clamp(2.8rem,7vw,4rem)] font-bold tracking-[-0.04em] text-slate-50">
            Copia il contesto e continua senza perdere il filo.
          </h1>
          <p className="mx-auto mt-6 max-w-[40rem] text-balance text-[1rem] leading-8 text-slate-400 sm:text-[1.08rem]">
            Qui sotto trovi il testo pronto da incollare nell&apos;app ChatGPT.
            Nessun riassunto a mano, nessun pezzo importante perso per strada.
          </p>
          <div className="mt-10 flex justify-center">
            <Button
              onClick={handleCopy}
              icon={copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            >
              {copied ? "Copiato" : "Copia testo"}
            </Button>
          </div>
        </div>
      </section>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-white/8 px-5 py-4 sm:px-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Anteprima
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Il bottone sopra copia l&apos;intero contenuto del file handoff.
          </p>
        </div>

        <div className="max-h-[65vh] overflow-auto px-5 py-5 sm:px-6 sm:py-6">
          <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-300">
            {content}
          </pre>
        </div>
      </Card>
    </div>
  );
}
