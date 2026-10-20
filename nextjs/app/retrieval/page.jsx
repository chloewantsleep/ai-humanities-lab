import ExperimentPage from "../components/ExperimentPage.jsx";
import RetrievalLab from "./RetrievalLab.jsx";
import "./retrieval.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Knowledge files" };

export default function Page() {
  return (
    <ExperimentPage name="retrieval">
      <RetrievalLab />
    </ExperimentPage>
  );
}
