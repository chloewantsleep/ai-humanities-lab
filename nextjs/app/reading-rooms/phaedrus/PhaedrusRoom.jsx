"use client";

import { useState } from "react";

const CLAIM = "Writing preserves what we know and makes it available to anyone who can read.";
const QUESTIONS = [
  "Does having a record mean that I remember?",
  "What if the reader misunderstands you?",
  "Who will defend this claim when you are gone?",
];

export default function PhaedrusRoom() {
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState([]);
  const [notice, setNotice] = useState("");

  function ask(event) {
    event.preventDefault();
    const text = question.trim();
    if (!text) return;
    setTurns((previous) => [...previous, { question: text, reply: "" }]);
    setQuestion("");
    setNotice("Question added. The written claim has repeated unchanged. You can write a response below it.");
  }

  function reset() {
    setQuestion("");
    setTurns([]);
    setNotice("Room reset. Your questions and replies have been cleared.");
  }

  return <div className="rr-exercise">
    <div className="rr-grid rr-workspace">
      <section className="rr-tablet" aria-labelledby="rr-claim-title">
        <p className="rr-kicker">A fixed inscription</p>
        <h3 id="rr-claim-title">One claim. Every reader.</h3>
        <p className="rr-inscription">{CLAIM}</p>
        <p className="rr-note">Invented teaching claim, inspired by Theuth's promise. This room always repeats it verbatim.</p>
      </section>
      <form className="rr-panel" onSubmit={ask}>
        <label htmlFor="rr-question">1. Put an objection to the inscription</label>
        <textarea id="rr-question" rows={3} maxLength={1000} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="What would you ask it to explain?" />
        <div className="rr-suggestions" aria-label="Suggested objections">
          {QUESTIONS.map((text) => <button type="button" key={text} onClick={() => setQuestion(text)}>{text}</button>)}
        </div>
        <div className="rr-actions">
          <button className="rr-primary" type="submit" disabled={!question.trim()}>Ask the inscription</button>
          <button type="button" onClick={reset}>Reset room</button>
        </div>
      </form>
    </div>
    <p className="rr-note" role="status">{notice || "No model or API call. Your writing is not saved and clears when you leave or reload."}</p>
    {turns.length === 0 ? <div className="rr-empty">Ask two different questions. Compare what changes and what stays fixed.</div> : <section aria-label="Questions and responses" className="rr-turns">
      {turns.map((turn, index) => <article key={index} className="rr-turn">
        <p className="rr-kicker">Encounter {String(index + 1).padStart(2, "0")}</p>
        <h3>{turn.question}</h3>
        <div className="rr-grid">
          <div className="rr-repeated"><p className="rr-kicker">The inscription repeats</p><p>{CLAIM}</p></div>
          <div>
            <label htmlFor={`rr-reply-${index}`}>2. Write a reply that addresses this objection</label>
            <textarea id={`rr-reply-${index}`} rows={3} maxLength={2000} value={turn.reply} placeholder="You supply the response. Nothing is generated or graded." onChange={(event) => {
              const value = event.target.value;
              setTurns((previous) => previous.map((item, position) => position === index ? { ...item, reply: value } : item));
            }} />
          </div>
        </div>
      </article>)}
    </section>}
    <div className="rr-discuss"><p className="rr-kicker">Carry back to the reading</p><h3>What did your reply have to know about the questioner?</h3><p>Point to a change you made: a distinction, an example, a concession. Does responsiveness establish understanding, or is it only one condition?</p></div>
  </div>;
}
