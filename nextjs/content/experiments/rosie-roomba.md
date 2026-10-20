---
title: Rosie and Roomba
description: "Two ways a machine can take on a job: as a person doing a person's job, or as a thing shaped by the work itself. The chat persona is Rosie; the agent working through your files is the Roomba. A step-through piece for presenting, and a component you can drop into any slide."
route: /rosie-roomba
status: working
group: "Where agents are going"
order: 1
---

## The idea (Marlon's)

From Marlon's dictation of October 2, 2026, about the week 2 workshop *Beyond the Chat Box*:

> Early on, we talked about the difference between Rosie and Roomba as solutions to the vacuum problem. In *The Jetsons*, they have a robot maid named Rosie, and we have a nice picture of her vacuuming. You'd imagine the way robots would fix the vacuuming problem is a human-like robot holding a vacuum. But what we actually got is the Roomba, which is much better. It just goes and does its thing. It's not threatening to become a member of the family. It does this one task, and does it well, with a small piece of intelligence, rather than trying to simulate the human, with all the attendant problems that might cause. For instance, if Rosie really does become human-like, she might rebel against having to vacuum. The Roomba will never rebel against having to vacuum.
>
> These agents are smarter than a Roomba, but they're similar in that they'll go off and do what they've been programmed to do. They'll try to achieve the goal, whether it's proofreading, checking citations, translating into French, or whatever you want done. They'll slowly work on the ground truth, which for the Roomba is the floor and for your agents is your data and the text you're working on. That's a very, very different model from the chat box.

And from his dictation of August 8, 2026, on agents as flat characters (the transcript spells it "Rumbas"):

> You would kind of want to emphasize the extent to which you're making [Roombas] rather than Rosies. You're making one-function bots, things that are reduced to their task.

It belongs in the part of the October 20 session on where agents are going.

## What was built

A component, `app/components/RosieRoomba.jsx` (with `RosieRoomba.css` beside it), shown full size on this page. It steps through six beats, each with Marlon's words beneath:

1. **rosie**: a humanlike robot maid walks the room, pushing a vacuum.
2. **roomba**: beside her, a disc crosses the floor plan of the same kind of room, turning when it bumps into walls and furniture; the cleaned floor spreads behind it, with a running "floor covered" figure.
3. **rebel**: Rosie stops, drops the vacuum, and wonders why it is her job. The Roomba keeps going.
4. **chat**: the same split for text. Rosie becomes a chat persona. Asked to check the citations in a chapter, she asks for it to be pasted in, praises it, and asks for the next one; the conversation's share of the context window fills as the chapters arrive.
5. **agent**: beside her, an agent, drawn as the same disc, works through a folder of twelve files, one after another, scanning each and marking it done, with no conversation. Each pass takes one of Marlon's three example tasks: check citations, proofread, translate into French.
6. **summary**: all four panels in a grid, the floor above and the text below, with the Roomba column marked as the one working on the ground truth.

All the figures are drawn in SVG for this page; there are no images of the Jetsons character or of any company's robot.

### How to use it

On this page: click the pictures or press ← → (or Space, or a clicker's page keys) to step; the keys work once the component has been clicked or tabbed to. **Present** fills the screen. Under "Use it in your own presentation" are the import line, the props, and a working example of `<RosieRoomba beats={["chat", "agent"]} compact />` inside a 16:9 slide.

With reduced motion turned on in the operating system, nothing moves: each panel shows a still moment mid-task.

### What Claude added (not Marlon's framing)

- Rosie is drawn at eye level, from the side, as one sees a person; the Roomba is drawn from above, as a floor plan, the way the task sees the room. The text row repeats this: a conversation window for the persona, a folder for the agent.
- The agent is drawn as the Roomba's disc, to make the rhyme visible.
- The chat persona's context meter, which draws on another passage of the same dictation (that a conversation with a model has a length limit, so "you'll have to find ways of starting a new chat").
- Rosie's thought bubble ("Why am I the one who vacuums?") and the dialogue in the chat window are written for the illustration.
- The Roomba's path is a simple simulation: drive straight, turn a random amount on a bump. It is not a model of how any real robot vacuum navigates; newer ones map the room and clean in rows (verify before saying more).

## Open questions

- Is the chat persona fair? It is a caricature (praise, and "paste it here"). A Claude project or a custom GPT with knowledge files can be given several files at once; the point Marlon makes is about where the work lives, not that chat tools cannot read files. A beat that shows a chat with an attached file might keep the contrast honest.
- Should there be a seventh beat for Marlon's flat-characters argument (allegory, single-function characters, holding on to human roundness)? The summary uses one line of it.
- Does Marlon want the beats in a different order, or to begin with the text and reveal the vacuum analogy second?
- Rosie's figure is generic (metal body, apron, cap). If it reads too much like the cartoon, it can be made more generic still.

## How this was made

Built by Claude Code (Opus 5.5) on October 20, 2026, as task W on the orchestration board, thread `5a37ec19-b531-4780-b7f0-44e89d96cae8` (started in `the-notebook/`). Marlon asked to "make the Rosie/Roomba comparison a page and an always-available, reusable React component that Marlon can add to any presentation." Unfinished: it has not been tried in one of Marlon's actual slide decks, on a projector, or with a clicker.
