import ExperimentPage from "../components/ExperimentPage.jsx";
import MiniClaw from "./MiniClaw.jsx";
import "./mini-claw.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mini-claw" };

export default function Page() {
  return (
    <ExperimentPage name="mini-claw">
      <MiniClaw />
    </ExperimentPage>
  );
}
