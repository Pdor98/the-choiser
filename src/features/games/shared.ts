export const bottleDefaultChoices = [
  "Pizza night",
  "Movie marathon",
  "Sushi",
  "Gelato",
  "Road trip",
  "Game night",
];

export const wheelDefaultNames = [
  "Davide",
  "Giulia",
  "Marco",
  "Elena",
  "Luca",
  "Sara",
];

export const wheelSegmentColors = [
  "#22d3ee",
  "#fbbf24",
  "#fb7185",
  "#34d399",
  "#60a5fa",
  "#f97316",
  "#a78bfa",
  "#f472b6",
];

export function parseEntryInput(raw: string, maxEntries = 12) {
  const unique = new Set<string>();
  const entries: string[] = [];

  for (const chunk of raw.split(/[\n,]+/)) {
    const value = chunk.trim();
    const key = value.toLowerCase();

    if (!value || unique.has(key)) {
      continue;
    }

    unique.add(key);
    entries.push(value);

    if (entries.length >= maxEntries) {
      break;
    }
  }

  return entries;
}

export function roundGeometryValue(value: number, precision = 3) {
  return Number(value.toFixed(precision));
}

export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: roundGeometryValue(centerX + radius * Math.cos(angleInRadians)),
    y: roundGeometryValue(centerY + radius * Math.sin(angleInRadians)),
  };
}

export function describeWheelSegment(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(centerX, centerY, radius, endAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${roundGeometryValue(centerX)} ${roundGeometryValue(centerY)}`,
    `L ${start.x} ${start.y}`,
    `A ${roundGeometryValue(radius)} ${roundGeometryValue(radius)} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}
