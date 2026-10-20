import ExperimentPage from "../components/ExperimentPage.jsx";
import EnsembleLab from "./EnsembleLab.jsx";
import "./ensemble.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "The Ensemble" };

export default function Page() {
  return (
    <ExperimentPage name="ensemble">
      <EnsembleLab />
    </ExperimentPage>
  );
}
