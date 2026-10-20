import ExperimentPage from "../components/ExperimentPage.jsx";
import GetReady from "./GetReady.jsx";
import "./get-ready.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Get ready for the workshop" };

export default function Page() {
  return <ExperimentPage name="get-ready"><GetReady /></ExperimentPage>;
}
