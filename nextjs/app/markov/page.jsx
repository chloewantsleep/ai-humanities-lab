import ExperimentPage from "../components/ExperimentPage.jsx";
import MarkovLab from "./MarkovLab.jsx";
import "./markov.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Markov chains" };

export default function Page() {
  return (
    <ExperimentPage name="markov">
      <MarkovLab />
    </ExperimentPage>
  );
}
