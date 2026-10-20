"use client";

import { useEffect, useRef, useState } from "react";

// Track the section crossing the middle of the viewport. Each demo stays with its prose,
// and the 2023 builder occupies the full width. The bar remains visible during scrolling.

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function StoryShell({ steps, chapters, milestones, children }) {
  const [active, setActive] = useState(0);
  const column = useRef(null);

  useEffect(() => {
    const elements = [...(column.current?.querySelectorAll("[data-story-step]") || [])];
    if (!elements.length) return undefined;
    // A thin band across the middle of the window: whichever step overlaps it is the one being read.
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(Number(entry.target.dataset.storyStep));
      }
    }, { rootMargin: "-48% 0px -48% 0px", threshold: 0 });
    elements.forEach((element) => observer.observe(element));

    // The glide (from the first mk-chatbot-experiments version): each step's prose and figure rise and fade in as
    // they reach the window, and a figure that fits the window stays pinned beside its prose while the prose scrolls.
    const root = column.current;
    root.classList.add("is-gliding");
    const reveal = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add("is-in"); reveal.unobserve(entry.target); }
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    elements.forEach((element) => reveal.observe(element));
    const figures = [...root.querySelectorAll(".story-step-figure")];
    const fit = () => {
      const room = window.innerHeight - (parseFloat(getComputedStyle(root).getPropertyValue("--bar")) || 64) - 48;
      for (const figure of figures) figure.classList.toggle("is-pinned", figure.offsetHeight <= room);
    };
    const sizes = new ResizeObserver(fit);
    figures.forEach((figure) => sizes.observe(figure));
    window.addEventListener("resize", fit);
    return () => { observer.disconnect(); reveal.disconnect(); sizes.disconnect(); window.removeEventListener("resize", fit); root.classList.remove("is-gliding"); };
  }, []);

  const step = steps[active] || steps[0];
  const chapter = chapters[step?.chapter] || chapters[0];
  const fraction = steps.length > 1 ? active / (steps.length - 1) : 0;

  function goTo(index) {
    const target = document.getElementById(steps[index]?.id);
    target?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
  }

  return (
    <>
      <div className="story-bar" role="navigation" aria-label="Timeline">
        <div className="story-bar-now">
          <span className="story-bar-year">{step?.year?.label || "—"}</span>
          <span className="story-bar-chapter">{chapter ? `${chapter.number === 0 ? "Prologue" : chapter.number}. ${chapter.title}` : ""}</span>
        </div>
        <div className="story-track">
          <div className="story-track-line"><div className="story-track-fill" style={{ transform: `scaleX(${fraction})` }} /></div>
          {chapters.map((c) => (
            <button key={c.slug} type="button" className="story-track-chapter" style={{ left: `${(c.firstStep / Math.max(1, steps.length - 1)) * 100}%` }} onClick={() => goTo(c.firstStep)} aria-label={`Go to ${c.number === 0 ? "the prologue" : `chapter ${c.number}`}: ${c.title}`} />
          ))}
          {milestones.map((m) => (
            <button
              key={m.step}
              type="button"
              className={`story-track-dot${m.step <= active ? " is-past" : ""}${step && steps[m.step] && m.step === lastMilestoneAt(milestones, active) ? " is-current" : ""}`}
              style={{ left: `${(m.step / Math.max(1, steps.length - 1)) * 100}%` }}
              onClick={() => goTo(m.step)}
              aria-label={`${m.year ? `${m.year}: ` : ""}${m.label}`}
              title={`${m.year ? `${m.year} · ` : ""}${m.label}`}
            />
          ))}
        </div>
        <span className="story-bar-label" aria-live="polite">{currentLabel(milestones, active)}</span>
      </div>
      <div className="story-grid">
        <div className="story-steps" ref={column}>{children}</div>
      </div>
    </>
  );
}

function lastMilestoneAt(milestones, active) {
  let found = -1;
  for (const m of milestones) if (m.step <= active) found = m.step;
  return found;
}

function currentLabel(milestones, active) {
  const at = lastMilestoneAt(milestones, active);
  return milestones.find((m) => m.step === at)?.label || "";
}
