import ExperimentPage from "../components/ExperimentPage.jsx";
import ElizaChat from "./ElizaChat.jsx";
import "./eliza.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "ELIZA" };

export default function Page() {
  return (
    <ExperimentPage name="eliza">
      <ElizaChat />
    </ExperimentPage>
  );
}
