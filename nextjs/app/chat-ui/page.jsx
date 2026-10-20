import ExperimentPage from "../components/ExperimentPage.jsx";
import ChatInterface from "./ChatInterface.jsx";
import "./chat-ui.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "The familiar chat interface" };

export default function Page() {
  return <ExperimentPage name="chat-ui"><ChatInterface /></ExperimentPage>;
}
