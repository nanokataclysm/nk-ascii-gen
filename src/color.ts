export type ColorMode = "solid" | "rainbow";

export type Cell = {
  ch: string;
  code: number | null;
};

const CUBE = [0, 95, 135, 175, 215, 255] as const;

export const SOLID_SWATCHES: { label: string; code: number }[] = [
  { label: "Amber", code: 208 },
  { label: "Green", code: 82 },
  { label: "Cyan", code: 51 },
  { label: "Red", code: 196 },
  { label: "Magenta", code: 201 },
  { label: "Yellow", code: 226 },
  { label: "Blue", code: 33 },
  { label: "White", code: 15 },
];

function toLevel(v: number): number {
  if (v < 48) return 0;
  if (v < 115) return 1;
  if (v < 155) return 2;
  if (v < 195) return 3;
  if (v < 235) return 4;
  return 5;
}

function rgbToXterm(r: number, g: number, b: number): number {
  return 16 + 36 * toLevel(r) + 6 * toLevel(g) + toLevel(b);
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = ((h % 360) + 360) % 360 / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0, g = 0, b = 0;
  if (hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = l - c / 2;
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

export function hueToXterm(hue: number): number {
  const [r, g, b] = hslToRgb(hue, 1, 0.5);
  return rgbToXterm(r, g, b);
}

export function xtermToCss(code: number): string {
  if (code >= 16 && code <= 231) {
    const i = code - 16;
    const r = Math.floor(i / 36);
    const g = Math.floor((i % 36) / 6);
    const b = i % 6;
    return `rgb(${CUBE[r]}, ${CUBE[g]}, ${CUBE[b]})`;
  }
  if (code >= 232 && code <= 255) {
    const v = 8 + (code - 232) * 10;
    return `rgb(${v}, ${v}, ${v})`;
  }
  const basic: [number, number, number][] = [
    [0, 0, 0], [128, 0, 0], [0, 128, 0], [128, 128, 0],
    [0, 0, 128], [128, 0, 128], [0, 128, 128], [192, 192, 192],
    [128, 128, 128], [255, 0, 0], [0, 255, 0], [255, 255, 0],
    [0, 0, 255], [255, 0, 255], [0, 255, 255], [255, 255, 255],
  ];
  const [r, g, b] = basic[code] ?? [255, 255, 255];
  return `rgb(${r}, ${g}, ${b})`;
}

export function hexToXterm(hex: string): number {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return 208;
  const n = parseInt(m[1], 16);
  return rgbToXterm((n >> 16) & 255, (n >> 8) & 255, n & 255);
}

function bannerWidth(lines: string[]): number {
  return lines.reduce((w, line) => Math.max(w, line.length), 0);
}

export function colorize(
  banner: string,
  mode: ColorMode,
  solidCode: number,
): { cells: Cell[][]; ansi: string } {
  const lines = banner.split("\n");
  const width = Math.max(1, bannerWidth(lines));
  const cells: Cell[][] = lines.map((line) =>
    [...line].map((ch, x) => {
      if (ch === " ") return { ch, code: null };
      const code =
        mode === "solid"
          ? solidCode
          : hueToXterm((x / Math.max(1, width - 1)) * 360);
      return { ch, code };
    }),
  );

  const ansi = cells
    .map((row) => {
      let out = "";
      let prev: number | null | undefined = undefined;
      for (const cell of row) {
        if (cell.code === prev) {
          out += cell.ch;
          continue;
        }
        if (prev != null) out += "\x1b[0m";
        if (cell.code != null) out += `\x1b[38;5;${cell.code}m`;
        out += cell.ch;
        prev = cell.code;
      }
      if (prev != null) out += "\x1b[0m";
      return out;
    })
    .join("\n");

  return { cells, ansi };
}

export function pythonSnippet(
  phrase: string,
  font: string,
  mode: ColorMode,
  ansi: string,
): string {
  const payload = JSON.stringify(ansi);
  return `# Banner: ${JSON.stringify(phrase)} (font ${JSON.stringify(font)}, ${mode})
print(${payload})
`;
}
