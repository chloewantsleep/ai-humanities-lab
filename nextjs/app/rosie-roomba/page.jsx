import ExperimentPage from "../components/ExperimentPage.jsx";
import RosieRoomba from "../components/RosieRoomba.jsx";
import "./rosie-roomba.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Rosie and Roomba" };

const USAGE = `import RosieRoomba from "./components/RosieRoomba.jsx";

<RosieRoomba />                                     // all six beats, with captions
<RosieRoomba beats={["chat", "agent"]} compact />   // two beats, sized for a slide
<RosieRoomba keys="window" />                       // ← → and a clicker work anywhere on the page`;

const PROPS = [
  ["beats", `which beats, in order: "rosie", "roomba", "rebel", "chat", "agent", "summary" (default: all six)`],
  ["compact", "smaller labels, no captions, no Present button: for a slide"],
  ["captions", "show Marlon's words under each beat (default: on unless compact)"],
  ["keys", `"focus" (default: arrow keys once the component is clicked or tabbed to), "window" (anywhere on the page), or "none"`],
  ["step, onStepChange", "control the step from outside (a slide deck's own state); otherwise use defaultStep"],
  ["controls", "the arrows, dots, and Present button (default: on)"],
  ["paused, speed", "stop the animation, or run it faster or slower (default 1)"],
];

export default function Page() {
  return (
    <ExperimentPage name="rosie-roomba">
      <RosieRoomba />
      <section className="rr-usage">
        <h2>Use it in your own presentation</h2>
        <p>Click the pictures, or use ← →, to step through. <strong>Present</strong> fills the screen; a clicker&apos;s page keys work too. The component is two files with no dependencies beyond React: copy <code>app/components/RosieRoomba.jsx</code> and <code>RosieRoomba.css</code> into another Next app&apos;s <code>components/</code> folder.</p>
        <pre><code>{USAGE}</code></pre>
        <p>For example, <code>{`<RosieRoomba beats={["chat", "agent"]} compact />`}</code> in a 16:9 slide:</p>
        <div className="rr-slide-demo">
          <p className="rr-slide-title">Where agents are going</p>
          <RosieRoomba beats={["chat", "agent"]} compact />
        </div>
        <dl>
          {PROPS.map(([name, text]) => (
            <div key={name}><dt><code>{name}</code></dt><dd>{text}</dd></div>
          ))}
        </dl>
      </section>
    </ExperimentPage>
  );
}
