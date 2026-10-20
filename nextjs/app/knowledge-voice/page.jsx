import ExperimentPage from "../components/ExperimentPage.jsx";
import KnowledgeVoice from "./KnowledgeVoice.jsx";
import "./knowledge-voice.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Knowledge and voice" };

export default function Page() {
  return <ExperimentPage name="knowledge-voice">
    <KnowledgeVoice hasKey={Boolean(process.env.OPENROUTER_API_KEY?.trim())} />
  </ExperimentPage>;
}
