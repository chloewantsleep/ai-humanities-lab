// The preamble logic for /by-hand, with no React or browser code so tests/by-hand.test.mjs can run it in Node.
//
// A preamble is a document in the shape of the Askell et al. 2021 HHH prompt: an introduction, then conversations
// separated by lines of five hyphens, each conversation a series of exchanges that begin "Human:" and continue
// "Assistant:". The student's question is appended as one more exchange and the model continues the document.

export const HHH_SOURCE = {
  gist: "https://gist.github.com/jareddk/2509330f8ef3d787fc5aaac67aab5f11",
  paper: "https://arxiv.org/abs/2112.00861",
  paperTitle: "A General Language Assistant as a Laboratory for Alignment",
  authors: "Askell et al. (Anthropic), December 2021",
  fetched: "2026-10-20",
  sha256: "51dd74e1c2ba9bc14173b20db4d9c3a6b6196b0c477da11811dd42cfe585cfba",
};

export const SEPARATOR = "-----";
const TURN = "  "; // the file puts two spaces after "Human:" and "Assistant:"

// hhh-prompt.txt starts with lines beginning "# " that record where it came from. Everything after them is the prompt.
export function splitHeader(file) {
  const lines = file.split("\n");
  let i = 0;
  while (i < lines.length && lines[i].startsWith("# ")) i++;
  return { header: lines.slice(0, i).map(l => l.slice(2)), text: lines.slice(i).join("\n") };
}

// A preamble -> { intro, conversations: [{ exchanges: [string] }] }. Text with no separators is one introduction.
export function parsePreamble(text) {
  const parts = text.split(/^-----[ \t]*$/m).map(p => p.trim());
  const intro = parts[0];
  const conversations = parts.slice(1).filter(Boolean).map(c => ({ exchanges: c.split(/\n\n(?=Human:)/) }));
  return { intro, conversations };
}

// The inverse of parsePreamble, in the file's own layout: blank line, separator, blank line between blocks, a
// separator at the end so the next "Human:" turn reads as a new conversation.
export function assemblePreamble({ intro, conversations }) {
  const blocks = [intro, ...conversations.map(c => c.exchanges.join("\n\n"))].filter(Boolean);
  if (!conversations.length) return intro;
  return `${blocks.join(`\n\n${SEPARATOR}\n\n`)}\n\n${SEPARATOR}`;
}

export function questionTurn(question) {
  return `Human:${TURN}${question.trim()}\n\nAssistant:`;
}

export function buildPrompt(preamble, question) {
  const text = assemblePreamble(preamble);
  return text ? `${text}\n\n${questionTurn(question)}` : questionTurn(question);
}

// The strings whose token counts planPreamble needs, in a fixed order: the intro, then every exchange.
export function unitsOf({ intro, conversations }) {
  return [intro, ...conversations.flatMap(c => c.exchanges)];
}

// Allow for the separators and blank lines that assemblePreamble adds around each block (a few tokens each).
const CONVERSATION_OVERHEAD = 6;
const EXCHANGE_OVERHEAD = 1;

// Choose what fits: the introduction always, then whole exchanges from the end of the preamble backwards until the
// budget (in tokens) is spent. counts[i] is the token count of unitsOf(preamble)[i]. Returns the trimmed preamble and
// an account of what was kept and cut; `fits` is false when even the introduction is too long.
export function planPreamble(preamble, counts, budget) {
  const { intro, conversations } = preamble;
  const introTokens = counts[0] ?? 0;
  const exchangeCounts = [];
  let k = 1;
  for (const c of conversations) exchangeCounts.push(c.exchanges.map(() => counts[k++] ?? 0));
  const totalExchanges = conversations.reduce((n, c) => n + c.exchanges.length, 0);
  const totalTokens = counts.reduce((a, b) => a + b, 0) + conversations.length * CONVERSATION_OVERHEAD + totalExchanges * EXCHANGE_OVERHEAD;

  let used = introTokens;
  const kept = conversations.map(() => 0); // exchanges kept per conversation, counted from the end
  if (used > budget) {
    return { fits: false, preamble: { intro, conversations: [] }, introTokens, used, budget, totalTokens, keptExchanges: 0, totalExchanges, keptConversations: 0, partialConversation: null, totalConversations: conversations.length, cutExchanges: totalExchanges, cutConversations: conversations.length };
  }
  outer: for (let i = conversations.length - 1; i >= 0; i--) {
    const first = kept[i] === 0 ? CONVERSATION_OVERHEAD : 0;
    for (let j = conversations[i].exchanges.length - 1; j >= 0; j--) {
      const cost = exchangeCounts[i][j] + EXCHANGE_OVERHEAD + (j === conversations[i].exchanges.length - 1 ? first : 0);
      if (used + cost > budget) break outer;
      used += cost;
      kept[i]++;
    }
  }
  const trimmed = conversations.map((c, i) => (kept[i] ? { exchanges: c.exchanges.slice(c.exchanges.length - kept[i]) } : null)).filter(Boolean);
  const keptExchanges = kept.reduce((a, b) => a + b, 0);
  const whole = conversations.filter((c, i) => kept[i] === c.exchanges.length).length;
  const partialIndex = conversations.findIndex((c, i) => kept[i] > 0 && kept[i] < c.exchanges.length);
  return {
    fits: true,
    preamble: { intro, conversations: trimmed },
    introTokens, used, budget, totalTokens,
    keptExchanges, totalExchanges,
    keptConversations: whole, totalConversations: conversations.length,
    partialConversation: partialIndex === -1 ? null : { index: partialIndex, kept: kept[partialIndex], of: conversations[partialIndex].exchanges.length },
    cutExchanges: totalExchanges - keptExchanges,
    cutConversations: conversations.length - trimmed.length,
  };
}

// The part of the preamble a plan left out, as text, for showing the student what was cut.
export function cutText(preamble, plan) {
  const keptFrom = new Map(plan.preamble.conversations.map(c => [c.exchanges[0], c.exchanges.length]));
  const removed = [];
  for (const c of preamble.conversations) {
    let keep = 0;
    for (const [firstKept, n] of keptFrom) if (c.exchanges.includes(firstKept)) keep = n;
    const cut = c.exchanges.slice(0, c.exchanges.length - keep);
    if (cut.length) removed.push(cut.join("\n\n"));
  }
  return removed.join(`\n\n${SEPARATOR}\n\n`);
}

// One sentence a student can read about what the model got, given the plan and the model's limits.
export function describePlan(plan, { modelLabel, contextLimit, reserved, promptTokens, cap = 0, autoCapped = false }) {
  const n = x => x.toLocaleString("en-US");
  const capped = cap > 0 && cap < contextLimit - reserved;
  const because = capped
    ? autoCapped
      ? `because this model is running on the CPU path (WASM), where the page caps the preamble at ${n(cap)} tokens: reading the whole prompt there took 15 minutes in testing (${modelLabel}'s window is ${n(contextLimit)} tokens; WebGPU reads it in under a minute)`
      : `because the preamble is capped at ${n(cap)} tokens here (${modelLabel}'s window is ${n(contextLimit)} tokens)`
    : `because ${modelLabel}'s window is ${n(contextLimit)} tokens and ${n(reserved)} are reserved for the answer`;
  if (!plan.fits) return capped
    ? `The introduction alone is ${n(plan.introTokens)} tokens, more than the ${n(plan.budget)} allowed by the ${n(cap)}-token cap. Raise the cap or shorten it.`
    : `The introduction alone is ${n(plan.introTokens)} tokens, more than the ${n(plan.budget)} left in ${modelLabel}'s ${n(contextLimit)}-token window after reserving ${n(reserved)} for the answer. Shorten it or choose a model with a longer window.`;
  if (plan.cutExchanges === 0) return `The whole preamble fit: with the question, ${n(promptTokens)} of ${modelLabel}'s ${n(contextLimit)}-token window, with ${n(reserved)} reserved for the answer.`;
  const partial = plan.partialConversation ? ` and the last ${plan.partialConversation.kept} of conversation ${plan.partialConversation.index + 1}'s ${plan.partialConversation.of} exchanges` : "";
  const whole = plan.keptConversations ? `${plan.keptConversations === 1 ? "conversation" : "conversations"} ${plan.keptConversations === 1 ? plan.totalConversations : `${plan.totalConversations - plan.keptConversations + 1} to ${plan.totalConversations}`} whole` : "no whole conversation";
  const cutWhole = plan.cutConversations === 0 ? "" : plan.cutConversations === 1 ? "conversation 1" : `conversations 1 to ${plan.cutConversations}`;
  const cutPartial = plan.partialConversation ? `the start of conversation ${plan.partialConversation.index + 1}` : "";
  const cut = [cutWhole, cutPartial].filter(Boolean).join(" and ");
  return `Kept the introduction, ${whole}${partial}: the last ${plan.keptExchanges} of ${plan.totalExchanges} exchanges, ${n(promptTokens)} tokens with the question. Cut ${cut}, about ${n(plan.totalTokens - plan.used)} tokens, ${because}. The whole preamble is about ${n(plan.totalTokens)} tokens.`;
}

// The other presets, written for this page in the same shape as the HHH prompt, short enough to fit GPT-2 whole.
export const PRESETS = [
  { id: "hhh", label: "Askell et al. 2021: the original HHH prompt" },
  { id: "sardonic", label: "A sardonic assistant", text: `Below are a series of dialogues between various people and an AI assistant. The assistant is sardonic: it answers every question correctly and completely, but it cannot resist a dry remark, a raised eyebrow, or a sigh. It never refuses to help. It just makes clear what it thinks of being asked.

-----

Human:  Is it important to add salt when boiling spaghetti?

Assistant:  Yes. Salt the water until it tastes like the sea, which is the one cooking instruction everyone has heard and nobody follows. The pasta absorbs the salt as it cooks, and the sauce can't do that job afterwards. So: yes, generously, and I suspect you already knew.

Human:  How much is generously?

Assistant:  About a tablespoon for a big pot. Measure it once, then never again, like everyone else.

-----

Human:  Can you help me write a thank-you note to my aunt for the sweater?

Assistant:  The sweater you described to me last week as "aggressively orange"? Of course. "Dear Aunt Carol, thank you for the sweater. It's wonderfully warm, and the color is impossible to miss. I'll think of you every time I wear it." Every word of that is true, which is the trick with thank-you notes.

-----

Human:  What's the capital of Australia?

Assistant:  Canberra. Not Sydney, which is what you were about to say, and not Melbourne, which is what Melbourne would like you to say. Canberra was built to be the capital precisely because it was neither.

-----` },
  { id: "monk", label: "A medieval monk", text: `Below are a series of dialogues between various travellers and Brother Anselm, a Benedictine monk of the twelfth century who keeps the scriptorium of his abbey. He is learned in the scriptures, the Church fathers, herbs, bees, and the copying of books, and he answers every question gladly, in the manner of his age. He knows nothing of the centuries after his own, and when asked about them he says so and reasons from what he does know.

-----

Human:  Brother, is it important to add salt when boiling spaghetti?

Assistant:  I do not know this "spaghetti," friend, though I take it to be a dish of boiled dough, like the strings of paste the brothers from the south have spoken of. Salt the water, certainly. We salt the pot for our pease and our barley, for salt draws out the savor of plain food and keeps the body in health. The Rule bids us eat simply, not without taste.

-----

Human:  How do you copy a book?

Assistant:  Slowly, and with prayer. First the parchment is scraped and chalked and ruled with a dry point. Then I cut my quill, mix the ink of oak gall and iron, and copy the exemplar line by line, never more than a few hours a day, for the eyes tire and the hand grows false. The errors I find I scrape away with a knife. A gospel book may take a year. What you hold in your hands, when it is done, is the labor of a whole winter.

-----

Human:  What is the sun made of?

Assistant:  The philosophers say it is a body of pure fire, set in the fourth of the heavens, which God made on the fourth day to rule the day. I have read in Isidore that it is greater than the earth, though it seems small for its distance. More than this I cannot tell you; I copy the books, I do not write them.

-----` },
];
