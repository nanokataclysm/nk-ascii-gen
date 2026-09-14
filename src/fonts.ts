import figlet from "figlet";
import standard from "figlet/importable-fonts/Standard.js";
import big from "figlet/importable-fonts/Big.js";
import slant from "figlet/importable-fonts/Slant.js";
import shadow from "figlet/importable-fonts/Shadow.js";
import doom from "figlet/importable-fonts/Doom.js";
import banner from "figlet/importable-fonts/Banner.js";
import small from "figlet/importable-fonts/Small.js";
import ghost from "figlet/importable-fonts/Ghost.js";
import cyberlarge from "figlet/importable-fonts/Cyberlarge.js";
import ansiShadow from "figlet/importable-fonts/ANSI Shadow.js";

export const FONTS = [
  "Standard",
  "Big",
  "Slant",
  "Shadow",
  "Doom",
  "Banner",
  "Small",
  "Ghost",
  "Cyberlarge",
  "ANSI Shadow",
] as const;

export type FontName = (typeof FONTS)[number];

const FONT_DATA: Record<FontName, string> = {
  Standard: standard,
  Big: big,
  Slant: slant,
  Shadow: shadow,
  Doom: doom,
  Banner: banner,
  Small: small,
  Ghost: ghost,
  Cyberlarge: cyberlarge,
  "ANSI Shadow": ansiShadow,
};

let ready = false;

export function initFonts(): void {
  if (ready) return;
  figlet.defaults({ fetchFontIfMissing: false, font: "Standard" });
  for (const name of FONTS) {
    figlet.parseFont(name, FONT_DATA[name]);
  }
  ready = true;
}

export function sanitizeInput(raw: string): string {
  return raw.replace(/[\u0000-\u0008\u000A-\u001F\u007F]/g, "");
}

export function renderBanner(text: string, font: FontName): string {
  initFonts();
  const cleaned = sanitizeInput(text);
  if (!cleaned.trim()) return "";
  return figlet.textSync(cleaned, {
    font,
    width: 80,
    whitespaceBreak: true,
  });
}
