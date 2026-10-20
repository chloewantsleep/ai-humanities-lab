import Link from "next/link";
import { SiteHeader } from "../components/Chrome.jsx";
import PoetryTheme from "./PoetryTheme";

export const metadata = {
  title: "Poetry Gem",
  description: "Build a poetry bot, then inspect its instructions, knowledge, and tools.",
};

export default function PoetryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader current="workshop" />
      <div style={{ padding: "16px var(--gutter)", fontSize: 14 }}>
        <Link href="/workshop">← Today</Link> · Activity C: the Poetry Gem · Next: <Link href="/build-a-bot">Activity D, build your own bot →</Link>
      </div>
      <div id="main">
        <PoetryTheme>{children}</PoetryTheme>
      </div>
    </>
  );
}
