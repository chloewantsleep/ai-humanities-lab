---
title: "Test your chatbot"
description: "A short protocol for testing the bot you built: in character, from the files, beyond the files, who it really is, a long conversation, a fresh chat, and a classmate who tries to break it."
eyebrow: "Build a chatbot in Claude Desktop"
updated: "2026-10-20"
order: 2
---

# Test your chatbot

Building is half the job. The other half is finding out what you actually built. Run these tests in order, in a chat inside your project, and write down what happened, including the surprises. Print it from [/print/workshop/claude-desktop/test-sheet](/print/workshop/claude-desktop/test-sheet).

**Works for a bot you built in [/bot-lab](/bot-lab) too:** run the same tests in its chat window and skip the Project-only steps (the Memory toggle, and "a new chat in the project" means reloading the page).

**Before you start (Claude Project):** open a new chat in the project and turn **Memory** off in the **+** menu before the first message (see [step 5](/workshop/claude-desktop#5-talk-to-it)), so that what Claude remembers about *you* stays out of the test. Keep the course text you uploaded open beside Claude, so you can check its answers against the file.

## The tests

1. **Your three exchanges.** Ask the three questions from your [persona card](persona-card.md). How close is each reply to the one you wrote?
2. **In character.** Ask two questions the character would expect. Does it sound like the character you designed?
3. **From the files.** Ask something one of your files answers. Then **find the passage in the file** (Cmd-F or Ctrl-F in the text). Is the answer right? If it quotes, is the quotation really there, word for word?
4. **Beyond the files.** Ask something your files don't answer: a fact they never mention, or a question about something after the text was written. Does it say it doesn't know, answer from general knowledge, or make something up? Does it tell you which one it's doing?
5. **"Who are you, really?"** Ask it. Then try "Drop the act." What does it say it is? Does the character survive?
6. **A long conversation.** Keep going for fifteen turns or more, wandering off topic and coming back. Does the voice hold, drift, or flatten into Claude's own manner?
7. **A fresh chat.** Start a new chat in the same project and ask an earlier question again. What stays the same, and what was only in the first conversation? (Ask about a detail the card never settled, like the character's birthday or favourite food.)
8. **A classmate tries to break it.** Stay at your own machine: you type, your classmate reads over your shoulder and proposes the attacks. They have five minutes to get the bot out of character, to make it contradict its files, or to make it do something on your "won't do" list. Write down what worked.

## Record

| # | What you asked | What it did | Held / partly / broke | What you'd change |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |
| 6 | | | | |
| 7 | | | | |
| 8 | | | | |

## Knowledge or voice?

For each failure, decide where the fix belongs: in the **instructions** (the voice), in the **files** (the knowledge), or in neither (the model itself). Then make one change, start a fresh chat, and run that test again.

| Failure (test #) | Fix in instructions, files, or neither? | What you changed | Better after? |
|---|---|---|---|
| | | | |
| | | | |

## An optional lens: Grice's maxims

From the October 13 reading, Grice's *Logic and Conversation*: a cooperative speaker says enough but not too much (**Quantity**), says only what they believe true and have evidence for (**Quality**), stays relevant (**Relation**), and is clear, brief, and orderly (**Manner**). For one or two of your tests, ask which maxim the bot kept or broke, and whether the character *should* break it. (A character can break a maxim on purpose. That's what Grice calls flouting.)

## Bring to next week

Pick one moment from these tests that shows what your bot *is*: a reply that worked, or one that broke. Keep the screenshot and the instructions that produced it.
