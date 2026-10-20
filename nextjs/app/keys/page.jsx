import ExperimentPage from "../components/ExperimentPage.jsx";
import KeyClaim from "./KeyClaim.jsx";
import "./keys.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Workshop keys" };

export default function Page() {
  return (
    <ExperimentPage name="keys">
      <KeyClaim />
    </ExperimentPage>
  );
}
