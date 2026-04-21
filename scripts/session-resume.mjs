#!/usr/bin/env node

import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const currentRepo = "/Users/Davide/Projects/Choiser-local";
const legacyRepo = "/Users/Davide/Documents/progetto";
const clues = ["Choiser", "the-choiser", currentRepo, legacyRepo];

async function readJsonLines(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

async function walkJsonlFiles(rootDir) {
  if (!existsSync(rootDir)) {
    return [];
  }

  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(rootDir, entry.name);

      if (entry.isDirectory()) {
        return walkJsonlFiles(fullPath);
      }

      if (entry.isFile() && fullPath.endsWith(".jsonl")) {
        return [fullPath];
      }

      return [];
    }),
  );

  return files.flat();
}

function extractUserText(entry) {
  if (entry.type !== "response_item") {
    return null;
  }

  const payload = entry.payload;
  if (!payload || payload.type !== "message" || payload.role !== "user") {
    return null;
  }

  const text = (payload.content || [])
    .filter((item) => item.type === "input_text")
    .map((item) => item.text)
    .join("\n")
    .trim();

  return text || null;
}

function isNoiseMessage(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    return true;
  }

  if (
    trimmed.startsWith("<environment_context>") ||
    trimmed.startsWith("<turn_aborted>")
  ) {
    return true;
  }

  return false;
}

function shorten(text, maxLength = 140) {
  const compact = text.replace(/\s+/g, " ").trim();
  if (compact.length <= maxLength) {
    return compact;
  }

  return `${compact.slice(0, maxLength - 3)}...`;
}

async function loadSessionIndex(codexDir) {
  const indexPath = path.join(codexDir, "session_index.jsonl");
  if (!existsSync(indexPath)) {
    return new Map();
  }

  const entries = await readJsonLines(indexPath);
  return new Map(entries.map((entry) => [entry.id, entry]));
}

async function inspectSession(filePath, sessionIndex) {
  const entries = await readJsonLines(filePath);
  const meta = entries.find((entry) => entry.type === "session_meta");
  if (!meta) {
    return null;
  }

  const threadId = meta.payload?.id ?? "unknown";
  const cwd = meta.payload?.cwd ?? "unknown";
  const sessionTimestamp = meta.payload?.timestamp ?? meta.timestamp ?? "";

  const userMessages = entries
    .map(extractUserText)
    .filter(Boolean)
    .filter((text) => !isNoiseMessage(text));

  const mentionsProject = userMessages.some((text) =>
    clues.some((clue) => text.includes(clue)),
  );
  const matchesCwd = cwd === currentRepo || cwd === legacyRepo;

  if (!matchesCwd && !mentionsProject) {
    return null;
  }

  const indexEntry = sessionIndex.get(threadId);

  return {
    filePath,
    threadId,
    threadName: indexEntry?.thread_name ?? "Untitled session",
    updatedAt: indexEntry?.updated_at ?? sessionTimestamp,
    cwd,
    userMessages,
  };
}

function printSession(session, index) {
  console.log(`${index + 1}. ${session.threadName}`);
  console.log(`   Thread: ${session.threadId}`);
  console.log(`   Updated: ${session.updatedAt}`);
  console.log(`   CWD: ${session.cwd}`);
  console.log(`   File: ${session.filePath}`);

  const recentMessages = session.userMessages.slice(-3);
  if (recentMessages.length > 0) {
    console.log("   Recent prompts:");
    for (const message of recentMessages) {
      console.log(`   - ${shorten(message)}`);
    }
  }

  console.log("");
}

async function main() {
  const codexDir = path.join(os.homedir(), ".codex");
  const sessionIndex = await loadSessionIndex(codexDir);

  const files = [
    ...(await walkJsonlFiles(path.join(codexDir, "sessions"))),
    ...(await walkJsonlFiles(path.join(codexDir, "archived_sessions"))),
  ];

  const inspected = await Promise.all(
    files.map((filePath) => inspectSession(filePath, sessionIndex)),
  );

  const sessions = inspected
    .filter(Boolean)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

  if (sessions.length === 0) {
    console.log("No Codex sessions found for Choiser.");
    return;
  }

  console.log("Recovered Codex sessions for Choiser");
  console.log("");

  sessions.forEach((session, index) => {
    printSession(session, index);
  });
}

main().catch((error) => {
  console.error("Failed to recover Codex sessions.");
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
