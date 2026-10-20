import { SiteFooter, SiteHeader } from "../components/Chrome.jsx";
import StudioLoader from "../poetry-gem/StudioLoader";
import PoetryTheme from "../poetry-gem/PoetryTheme";
import { loadGenres, readVoice } from "../../lib/poetry-gem/content";
import { DELIVERY_LABELS, MATERIAL_LABELS, PACK_LABELS, PACKS } from "../../lib/poetry-gem/options";
import ResetShell from "./ResetShell.jsx";
import BotPage from "./BotPage.jsx";

export const metadata = { title: "Build a bot", description: "Build a poetry bot, reset the page, then fork it and design your own interface." };
export const dynamic = "force-dynamic";

// /build-a-bot (Activity D). At first it looks exactly like /poetry-gem (Activity C); RESET wipes it to BotPage.jsx, the plain form students fork and
// redesign. The catalog (prompt texts, pack voice notes, labels) is read here, on the server, and handed to BotPage.
export default function BuildABotRoute() {
  const genres = loadGenres();
  const catalog = {
    prompts: Object.fromEntries(genres.map((g) => [g.id, g.prompt])),
    promptLabels: Object.fromEntries(genres.map((g) => [g.id, g.label])),
    voices: Object.fromEntries(PACKS.map((p) => [p, p === "none" ? "" : readVoice(p)])),
    packLabels: PACK_LABELS,
    materialLabels: Object.fromEntries(Object.entries(MATERIAL_LABELS).map(([k, v]) => [k, v.label])),
    deliveryLabels: Object.fromEntries(Object.entries(DELIVERY_LABELS).map(([k, v]) => [k, v.label])),
  };
  return (
    <ResetShell
      plain={<BotPage catalog={catalog} />}
      header={<SiteHeader current="build-a-bot" />}
      footer={<SiteFooter />}
    >
      <PoetryTheme><StudioLoader /></PoetryTheme>
    </ResetShell>
  );
}
