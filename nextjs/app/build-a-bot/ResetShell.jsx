"use client";

// The frame around /build-a-bot. At first: the Poetry Gem exactly as on /poetry-gem, plus a big RESET button. After
// RESET: only BotPage. Students don't need to edit this file. The reset is remembered in the address (#reset), so a
// refresh in your fork stays reset.

import { useEffect, useState } from "react";
import Link from "next/link";
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
      <div className="reset-bar">
        <div className="reset-bar-text">
          <Link href="/">← Today</Link>
          <strong>Activity D: build your own bot.</strong>
          <span>It starts as the Poetry Gem. Try it, then press Reset to strip it down to the data, and redesign it yourself.</span>
        </div>
        <button type="button" className="reset-button" onClick={reset}>Reset</button>
      </div>
      <div id="main" className="reset-main">{children}</div>
      {footer}
      <div className="reset-wipe" aria-hidden="true" />
    </div>
  );
}
