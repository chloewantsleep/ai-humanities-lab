// ELIZA as an assistant-ui ChatModelAdapter, for the shared chat shell (`<ChatShell adapter={elizaAdapter} />`).
// assistant-ui hands the adapter the whole thread on every turn, so ELIZA's state (the counter, the memory stack, and
// where each rule is in its reassembly cycle) is rebuilt from the user's earlier messages. The rule that made the
// reply goes in the message's metadata.custom.rule.

import { doctor } from "./index.mjs";

const text = message => message.content.filter(part => part.type === "text").map(part => part.text).join("\n");

export function createElizaAdapter(eliza = doctor) {
  return {
    async run({ messages, abortSignal }) {
      abortSignal?.throwIfAborted();
      const said = messages.filter(m => m.role === "user").map(text);
      const { reply, rule } = eliza.respond(said.at(-1) ?? "", eliza.replay(said.slice(0, -1)));
      return { content: [{ type: "text", text: reply }], metadata: { custom: { rule } } };
    },
  };
}

export const elizaAdapter = createElizaAdapter();
