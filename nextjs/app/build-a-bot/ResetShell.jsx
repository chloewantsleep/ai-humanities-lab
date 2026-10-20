"use client";

// The frame around /build-a-bot: the full studio with a RESET button, and after RESET, only BotPage. Students don't
// need to edit this file. The reset is remembered in the address (#reset), so a refresh in your fork stays reset.

import { useEffect, useState } from "react";
import "./reset.css";

export default function ResetShell({ children, plain, header, footer }) {
  const [mode, setMode] = useState("full"); // full | wiping | plain
  useEffect(() => { if (window.location.hash === "#reset") setMode("plain"); }, []);

  function reset() {
    history.replaceState(null, "", "#reset");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setMode("plain"); window.scrollTo(0, 0); return; }
    setMode("wiping");
    setTimeout(() => { setMode("plain"); window.scrollTo(0, 0); }, 900);
  }
  function undo() {
    history.replaceState(null, "", window.location.pathname);
    setMode("full");
  }

  if (mode === "plain") {
    return (
      <div className="reset-plain">
        <button type="button" className="reset-undo" onClick={undo}>← back to the full studio</button>
        {plain}
      </div>
    );
  }
  return (
    <div className={`reset-full${mode === "wiping" ? " is-wiping" : ""}`}>
      {header}
      <main id="main" className="reset-main">
        <header className="reset-intro">
          <p className="eyebrow">2023 – 2024 · The configuration era</p>
          <h1>Build a bot</h1>
          <span className="deco-rule" />
          <p>
            This is the Poetry Gem, the full builder: instructions on top, a reading pack in the middle, a way of delivering it
            below, all drawn as a paper doll. Try it. Then press <strong>Reset</strong>. Everything you see here will be wiped
            away, down to the few choices the bot is actually made of. Your job is to build a better interface for those choices.
          </p>
          <button type="button" className="reset-button" onClick={reset}>Reset</button>
        </header>
        {children}
        <div className="reset-again">
          <p>Seen enough of the paper dolls?</p>
          <button type="button" className="reset-button" onClick={reset}>Reset</button>
        </div>
      </main>
      {footer}
      <div className="reset-wipe" aria-hidden="true" />
    </div>
  );
}
