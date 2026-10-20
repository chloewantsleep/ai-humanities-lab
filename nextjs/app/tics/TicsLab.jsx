'use client';
import { useState } from 'react';
import { analyze, rules } from './detector.mjs';
export default function TicsLab({ samples }) {
  const [slot, setSlot] = useState('laughter');
  const [texts, setTexts] = useState(Object.fromEntries([...samples.map(s=>[s.id,s.text]), ['model-a',''], ['model-b','']]));
  const [labels,setLabels] = useState({ 'model-a':'', 'model-b':'' });
  const text = texts[slot];
  const result = analyze(text);
  const sample = samples.find(s=>s.id===slot);
  const boundaries = [...new Set([0,text.length,...result.matches.flatMap(m=>[m.start,m.end])])].sort((a,b)=>a-b);
  return <div className="tics-lab">
    <p className="tics-warning">A pattern finder for discussion. These crude rules flag candidates, miss variants, and produce false positives. Counts are not an AI detector, a quality score, or evidence about training causes. Text stays in this page; reloading clears your slots.</p>
    <div className="tics-controls"><label>Passage <select value={slot} onChange={e=>setSlot(e.target.value)}>{samples.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}<option value="model-a">Your text · A</option><option value="model-b">Your text · B</option></select></label>{sample && <a href={sample.source}>Source · Project Gutenberg</a>}</div>
    {!sample && <label>Record model, date, and prompt (or human author)<input value={labels[slot]} onChange={e=>setLabels({...labels,[slot]:e.target.value})} placeholder="Provenance for this comparison"/></label>}
    <label>Paste or edit text<textarea rows={10} value={text} onChange={e=>setTexts({...texts,[slot]:e.target.value})}/></label>
    <p aria-live="polite">{result.words} words · {result.matches.length} candidate matches · rates are matches per 1,000 words</p>
    <div className="tics-legend">{result.counts.map(r=><div className={`tic-${r.id}`} key={r.id}><strong>{r.label}</strong><span>{r.count} matches · {r.rate.toFixed(1)} / 1,000</span><small>{r.hint}</small></div>)}</div>
    <details className="tics-comparison"><summary>Compare all four slots</summary><p>Rates per 1,000 words. Different genres and short samples are not controlled comparisons.</p><div className="tics-table-scroll"><table><thead><tr><th scope="col">Passage</th><th scope="col">Words</th>{rules.map(r=><th scope="col" key={r.id}>{r.label}</th>)}</tr></thead><tbody>{Object.entries(texts).map(([id,value])=>{const analysis=analyze(value);return <tr key={id}><th scope="row">{samples.find(s=>s.id===id)?.label || labels[id] || (id==='model-a'?'Your text A':'Your text B')}</th><td>{analysis.words}</td>{analysis.counts.map(r=><td key={r.id}>{analysis.words ? r.rate.toFixed(1) : '—'}</td>)}</tr>;})}</tbody></table></div></details>
    <h2>Read the marks</h2><p>Overlapping matches carry all their labels in the tooltip and in the match list below.</p>
    <div className="tics-preview">{boundaries.slice(0,-1).map((start,i)=>{const end=boundaries[i+1];const active=result.matches.filter(m=>m.start<=start&&m.end>=end);return active.length ? <mark key={start} className={`tic-${active[0].id}`} title={active.map(m=>rules.find(r=>r.id===m.id).label).join(' · ')}>{text.slice(start,end)}</mark> : <span key={start}>{text.slice(start,end)}</span>;})}{!text && 'Paste a passage to begin.'}</div>
    <details><summary>Inspect every match ({result.matches.length})</summary><ol>{result.matches.map((m,i)=><li key={i}><strong>{rules.find(r=>r.id===m.id).label}</strong> · characters {m.start+1}–{m.end}<blockquote>{m.text}</blockquote></li>)}</ol></details>
    <section className="tics-context"><h2>Three separate layers</h2>
    <h3>Marlon’s observation</h3><p>In his October 19 notes, Marlon observes that LLMs overuse antithetical formulations and heightened binary oppositions—moves he used to teach as a writing teacher. This page provides a way to inspect examples; it does not establish their frequency across models.</p>
    <h3>Bergson’s lens</h3><blockquote>“Something mechanical encrusted on the living”</blockquote><blockquote>“Wherever there is repetition or complete similarity, we always suspect some mechanism at work behind the living.”</blockquote><p>Henri Bergson, <a href="https://www.gutenberg.org/files/4352/4352-h/4352-h.htm#chap01">Laughter, Chapter I</a>, translated by Cloudesley Brereton and Fred Rothwell. When does a repeated rhetorical move feel responsive to a thought, and when does it feel automatic? Does Bergson’s own passage change your judgment?</p>
    <h3>A causal hypothesis to investigate</h3><p>The canvas’s separate Opus reflections propose that preference training might reward these surface forms. These counts cannot test that explanation. Comparisons would need matched prompts, repeated samples, model and training information, and alternative explanations such as genre, source texts, and instructions.</p></section>
  </div>;
}
