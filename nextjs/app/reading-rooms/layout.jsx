import ExperimentPage from "../components/ExperimentPage.jsx";
import "./reading-rooms.css";

export default function ReadingRoomsLayout({ children }) {
  return <ExperimentPage name="reading-rooms"><div className="reading-rooms">{children}</div></ExperimentPage>;
}
