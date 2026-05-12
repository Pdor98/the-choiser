import { readFileSync } from "node:fs";
import path from "node:path";

import { ChatGptCopyPanel } from "@/components/chatgpt-copy-panel";

export const metadata = {
  title: "ChatGPT Copy · Choiser",
  description: "Testo pronto da copiare e incollare nell'app ChatGPT.",
};

export default function ChatGptCopyPage() {
  const filePath = path.join(process.cwd(), "CHATGPT_COPY_PASTE.md");
  const content = readFileSync(filePath, "utf8");

  return <ChatGptCopyPanel content={content} />;
}
