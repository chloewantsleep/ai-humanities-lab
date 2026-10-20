import ExperimentPage, { NotBuiltYet } from "../components/ExperimentPage.jsx";

export const dynamic = "force-dynamic";
export const metadata = { title: "The persona dial" };

export default function Page() {
  return (
    <ExperimentPage name="persona-dial">
      <NotBuiltYet task="task E" />
    </ExperimentPage>
  );
}
