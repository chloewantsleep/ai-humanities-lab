import ExperimentPage from "../components/ExperimentPage.jsx";
import SpiralRoom from "./SpiralRoom.jsx";
import "./spiral.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "GPT-2, before the assistant" };

export default function Page() {
  return (
    <ExperimentPage name="gpt-2">
      <SpiralRoom />
    </ExperimentPage>
  );
}
