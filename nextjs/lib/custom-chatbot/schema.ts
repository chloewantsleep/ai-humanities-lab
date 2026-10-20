import { z } from "zod";
import { PACKS, MATERIALS, DELIVERIES } from "../poetry-gem/options";

export const LIMITS = { name: 80, student: 120, prompt: 20_000, knowledge: 8_000, notes: 8_000, icon: 2_000 };
const optionalText = (max: number) => z.string().trim().max(max).default("");
export const BotSettings = z.object({
  genre: z.string().trim().min(1).max(80),
  pack: z.enum(PACKS),
  material: z.enum(MATERIALS),
  delivery: z.enum(DELIVERIES),
}).strict();

export const BotVoice = z.object({
  framingPrompt: z.string().trim().min(1, "Add a framing prompt.").max(LIMITS.prompt, "Keep the framing prompt under 20,000 characters."),
  knowledge: optionalText(LIMITS.knowledge),
  notes: optionalText(LIMITS.notes),
  model: optionalText(160),
});

export const Submission = BotVoice.extend({
  agentName: z.string().trim().min(1, "Give your bot a name.").max(LIMITS.name),
  student: z.string().trim().min(1, "Add your name.").max(LIMITS.student),
  iconUrl: optionalText(LIMITS.icon).refine(value => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === "https:" && !url.username && !url.password;
    } catch { return false; }
  }, "Use an https:// image URL, or leave the icon blank."),
  settings: BotSettings,
}).strict();

export type BotDraft = z.infer<typeof Submission>;

export function previewSystem(bot: z.infer<typeof BotVoice>) {
  return [
    bot.framingPrompt,
    bot.knowledge ? `Reference knowledge:\n${bot.knowledge}` : "",
    bot.notes ? `Student notes — possible triggers and extra instructions:\n${bot.notes}` : "",
  ].filter(Boolean).join("\n\n");
}
