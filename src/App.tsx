import { useMemo, useState, type CSSProperties } from "react";
import { FONTS, renderBanner, type FontName } from "./fonts";
import {
  SOLID_SWATCHES,
  colorize,
  pythonSnippet,
  xtermToCss,
  type ColorMode,
} from "./color";
import "./App.css";

export default function App() {
  const [text, setText] = useState("httpx");
  const [font, setFont] = useState<FontName>("Slant");
  const [mode, setMode] = useState<ColorMode>("solid");
  const [solidCode, setSolidCode] = useState(208);
  const [copied, setCopied] = useState<"ansi" | "python" | null>(null);

  const banner = useMemo(() => renderBanner(text, font), [text, font]);
  const colored = useMemo(
    () => (banner ? colorize(banner, mode, solidCode) : null),
    [banner, mode, solidCode],
  );

  async function copy(kind: "ansi" | "python") {
    if (!colored) return;
    const payload =
      kind === "ansi"
        ? colored.ansi
        : pythonSnippet(text, font, mode, colored.ansi);
    await navigator.clipboard.writeText(payload);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1400);
  }

  const empty = !banner;

  return (
    <div className="shell">
      <header className="mast">
        <p className="mast-kicker">for CLI authors on Linux</p>
        <h1>Banner press</h1>
        <p className="mast-lead">
          Type a tool name. Pick a FIGlet font. Copy ANSI or a Python print()
          with colors already baked in.
        </p>
      </header>

      <div className="layout">
        <aside className="panel">
          <label className="field">
            <span>Phrase</span>
            <input
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="your CLI name"
              spellCheck={false}
              autoComplete="off"
            />
          </label>

          <label className="field">
            <span>Font</span>
            <select
              value={font}
              onChange={(e) => setFont(e.target.value as FontName)}
            >
              {FONTS.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <fieldset className="field">
            <legend>Color</legend>
            <div className="segment" role="group" aria-label="Color mode">
              <button
                type="button"
                className={mode === "solid" ? "on" : ""}
                onClick={() => setMode("solid")}
              >
                Solid color
              </button>
              <button
                type="button"
                className={mode === "rainbow" ? "on" : ""}
                onClick={() => setMode("rainbow")}
              >
                Rainbow gradient
              </button>
            </div>
          </fieldset>

          {mode === "solid" && (
            <div className="swatches" role="listbox" aria-label="Solid color">
              {SOLID_SWATCHES.map((swatch) => (
                <button
                  key={swatch.code}
                  type="button"
                  role="option"
                  aria-selected={solidCode === swatch.code}
                  title={`${swatch.label} (256-color ${swatch.code})`}
                  className={solidCode === swatch.code ? "chip on" : "chip"}
                  style={{ "--chip": xtermToCss(swatch.code) } as CSSProperties}
                  onClick={() => setSolidCode(swatch.code)}
                >
                  {swatch.label}
                </button>
              ))}
            </div>
          )}
        </aside>

        <section className="stage">
          <div className="crt" aria-live="polite">
            {empty ? (
              <p className="hint">Type a CLI name to render a banner.</p>
            ) : (
              <pre>
                {colored!.cells.map((row, i) => (
                  <span key={i} className="row">
                    {row.map((cell, j) =>
                      cell.code == null ? (
                        <span key={j}>{cell.ch}</span>
                      ) : (
                        <span
                          key={j}
                          style={{ color: xtermToCss(cell.code) }}
                        >
                          {cell.ch}
                        </span>
                      ),
                    )}
                    {i < colored!.cells.length - 1 ? "\n" : null}
                  </span>
                ))}
              </pre>
            )}
          </div>
          <p className="font-meta">{font}</p>
          <div className="actions">
            <button
              type="button"
              disabled={empty}
              onClick={() => void copy("ansi")}
            >
              {copied === "ansi" ? "Copied!" : "Copy ANSI"}
            </button>
            <button
              type="button"
              disabled={empty}
              onClick={() => void copy("python")}
            >
              {copied === "python" ? "Copied!" : "Copy Python snippet"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
