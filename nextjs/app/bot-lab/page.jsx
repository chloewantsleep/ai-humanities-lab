import ExperimentPage from "../components/ExperimentPage.jsx";
import BotLab from "./BotLab.jsx";
import "./bot-lab.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "The bot lab" };

export default function Page() {
  return (
    <ExperimentPage name="bot-lab">
      <BotLab />
    </ExperimentPage>
  );
}
