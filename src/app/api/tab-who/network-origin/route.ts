import { networkInterfaces } from "node:os";

import { NextResponse } from "next/server";

function isPrivateIpv4(address: string) {
  const parts = address.split(".").map(Number);

  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    return false;
  }

  return (
    parts[0] === 10 ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168)
  );
}

function getLanAddress() {
  const addresses = Object.values(networkInterfaces())
    .flatMap((entries) => entries ?? [])
    .filter(
      (entry) =>
        entry.family === "IPv4" && !entry.internal && !entry.address.startsWith("169.254."),
    )
    .map((entry) => entry.address);

  return addresses.find(isPrivateIpv4) ?? addresses[0] ?? null;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const lanAddress = getLanAddress();

  if (!lanAddress) {
    return NextResponse.json(
      { error: "Indirizzo di rete non disponibile." },
      { status: 404 },
    );
  }

  const port = requestUrl.port ? `:${requestUrl.port}` : "";

  return NextResponse.json({
    origin: `${requestUrl.protocol}//${lanAddress}${port}`,
  });
}
