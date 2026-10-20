import ExperimentPage from "../components/ExperimentPage.jsx";
import RagPipeline from "./RagPipeline.jsx";
import "./rag.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "RAG, step by step" };

export default function Page() {
  return (
    <ExperimentPage name="rag">
      <RagPipeline />
    </ExperimentPage>
  );
}
