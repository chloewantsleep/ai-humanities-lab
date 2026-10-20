import ExperimentPage from "../components/ExperimentPage.jsx";
import LayersLab from "./LayersLab.jsx";
import "./layers.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "The layers around the model" };

export default function Page() {
  return (
    <ExperimentPage name="layers">
      <LayersLab />
    </ExperimentPage>
  );
}
