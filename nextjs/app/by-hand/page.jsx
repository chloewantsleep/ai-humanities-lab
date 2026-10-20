import { readFile } from "node:fs/promises";
import path from "node:path";
import ExperimentPage from "../components/ExperimentPage.jsx";
import ByHandLab from "./ByHandLab.jsx";

export const dynamic = "force-dynamic";
export const metadata = { title: "Building the assistant by hand" };

// The HHH prompt is read here, on the server, so the client gets the exact bytes of app/by-hand/hhh-prompt.txt.
export default async function Page() {
  const hhhFile = await readFile(path.join(process.cwd(), "app", "by-hand", "hhh-prompt.txt"), "utf8");
  return (
    <ExperimentPage name="by-hand">
      <ByHandLab hhhFile={hhhFile} />
    </ExperimentPage>
  );
}
