"use client";

// ============================================================================================================
//  THIS IS THE FILE TO REDESIGN.   nextjs/app/build-a-bot/BotPage.jsx
//
//  It is deliberately ugly: browser defaults, Times, a grey rule. Make it into any interface you like: a chat,
//  a card game, a costume shop, a form from 1998, a terminal. Look at /history for 60 years of chat interfaces.
//
//  The one rule: in the end, call submitBot(choices, catalog) with a `choices` object that has the keys in
//  contract.js (botName, studentName, prompt, pack, material, delivery, and optional extras), and keep
//  <Watcher choices={choices} catalog={catalog} /> on the page. The watcher turns red if you drift.
//  Anything extra your design collects (a color, a mood, a costume) goes in `extras`, as text or JSON.
//
//  `catalog` comes from page.jsx: prompts (id -> text), promptLabels, voices (pack -> voice note), packLabels,
//  materialLabels, deliveryLabels. Don't edit contract.js, Watcher.jsx, or page.jsx.
// ============================================================================================================

import { useState } from "react";
import { submitBot } from "./contract.js";
import Watcher from "./Watcher.jsx";

const REPO = "https://github.com/ll-26-27/eng298ai-20261020";

export default function BotPage({ catalog }) {
  const [choices, setChoices] = useState({ botName: "", studentName: "", prompt: "", pack: "", material: "", delivery: "", extras: "" });
  const [result, setResult] = useState(null);
  const [sending, setSending] = useState(false);
  const set = (key) => (e) => { setChoices({ ...choices, [key]: e.target.value }); setResult(null); };

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    try { setResult(await submitBot(choices, catalog)); }
    catch (error) { setResult({ ok: false, error: error.message }); }
    setSending(false);
  }

  return (
    <div style={{ maxWidth: 720, padding: "8px 16px 80px", fontFamily: 'Times, "Times New Roman", serif', fontSize: 16, lineHeight: 1.35 }}>
      <h1 style={{ fontFamily: "inherit", fontWeight: "bold", letterSpacing: 0, fontSize: 32 }}>Build a bot</h1>
      <p>This is everything your bot is made of. The paper dolls are gone. What is left is the data.</p>

      <h2 style={{ fontFamily: "inherit", fontWeight: "bold", letterSpacing: 0, fontSize: 22 }}>How the data flows</h2>
      <ol>
        <li>You choose a <b>prompt</b>: the instructions, written in front of every conversation (like the HHH prompt of 2021).</li>
        <li>You choose a <b>knowledge pack</b>: a course reading the bot can draw on, and <b>how much</b> of it.</li>
        <li>You choose the <b>retrieval / tooling</b>: how the reading reaches the model. The whole text every time, a keyword search,
          a meaning-based (embedding) search, or a search tool the model calls itself.</li>
        <li>You give the bot a <b>name</b> and put <b>your name</b> on it.</li>
        <li>You press <b>Submit</b>. The page sends one record to the class&apos;s Airtable table, and the Ensemble picks your bot up from there.</li>
      </ol>
      <p>Prompt → knowledge → retrieval → name → submit → Airtable → Ensemble. That&apos;s all a 2023 &ldquo;GPT&rdquo; or &ldquo;Gem&rdquo; was.</p>

      <hr />

      <form onSubmit={submit}>
        <p>
          Bot name:<br />
          <input value={choices.botName} onChange={set("botName")} maxLength={80} size={40} />
        </p>
        <p>
          Your name:<br />
          <input value={choices.studentName} onChange={set("studentName")} maxLength={120} size={40} />
        </p>
        <p>
          Prompt (instructions):<br />
          <select value={choices.prompt} onChange={set("prompt")}>
            <option value="">-- choose --</option>
            {Object.keys(catalog.prompts).map((id) => <option key={id} value={id}>{catalog.promptLabels[id] ?? id}</option>)}
          </select>
        </p>
        <p>
          Knowledge pack:<br />
          <select value={choices.pack} onChange={set("pack")}>
            <option value="">-- choose --</option>
            {Object.entries(catalog.packLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
          {" "}How much:{" "}
          <select value={choices.material} onChange={set("material")}>
            <option value="">-- choose --</option>
            {Object.entries(catalog.materialLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
        </p>
        <p>
          Retrieval / tooling:<br />
          <select value={choices.delivery} onChange={set("delivery")}>
            <option value="">-- choose --</option>
            {Object.entries(catalog.deliveryLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
        </p>
        <p>
          Anything else (optional; saved as long text):<br />
          <textarea value={choices.extras} onChange={set("extras")} rows={3} cols={50} />
        </p>
        <p><input type="submit" value={sending ? "Sending..." : "Submit"} disabled={sending} style={{ fontSize: 18 }} /></p>
        {result && (result.ok
          ? <p><b>Saved.</b> Your bot is in the table{result.slug ? ` as "${result.slug}"` : ""}. Submit again with the same name to update it.</p>
          : <p style={{ color: "red" }}>Not saved: {result.error} {result.fields ? Object.values(result.fields).join(" ") : ""}</p>)}
      </form>

      <hr />

      <h2 style={{ fontFamily: "inherit", fontWeight: "bold", letterSpacing: 0, fontSize: 22 }}>Your task: fork this page</h2>
      <p>You could just use the drop-downs above and press Submit. Don&apos;t, yet. Your task is to give these same choices a better interface, any interface you like, and submit your bot from <i>that</i>.</p>
      <ol>
        <li>On GitHub, fork <a href={REPO}>{REPO.replace("https://", "")}</a> to your own account.</li>
        <li>Open the Claude desktop app, go to <b>Code</b>, and open your fork (ask Claude to clone it if you need to).</li>
        <li>Ask Claude: <i>&ldquo;Set this up and run it.&rdquo;</i> It installs the app in <tt>nextjs/</tt> and starts it. Paste the three <tt>AIRTABLE_</tt> lines your instructor gives you into <tt>nextjs/.env.local</tt> (never commit that file).</li>
        <li>Open <tt>http://localhost:3000/build-a-bot</tt>, press Reset, and you&apos;ll see this page.</li>
        <li>Ask Claude to redesign <tt>nextjs/app/build-a-bot/BotPage.jsx</tt>, and only that file. Describe the interface you want. Browse <a href="/history">Interfaces</a> for a history of chat interfaces, 1966 to 2026, if you need ideas.</li>
        <li>Keep the watcher box in the corner green. If your design collects something new, put it in <tt>extras</tt>.</li>
        <li>Submit your bot from your new interface.</li>
      </ol>
      <p>Claude Code also watches: after each edit it checks that the page still sends what the Airtable table needs, and tells you if it doesn&apos;t.</p>

      <Watcher choices={choices} catalog={catalog} />
    </div>
  );
}
