---
title: "Course texts to upload"
description: "Six public-domain course texts from Project Gutenberg, ready to download and add to a Claude Project as knowledge."
eyebrow: "Build a chatbot in Claude Desktop"
updated: "2026-10-20"
order: 3
---

# Course texts to upload

Six of the course readings, from Project Gutenberg, ready to add to your project's knowledge. Download a file to your computer, then upload it in step 4 of [Build a chatbot in Claude Desktop](/workshop/claude-desktop).

**Use the .txt file.** TXT is on Anthropic's list of document types you can upload; Markdown (.md) isn't on that list, though it is plain text too. Each file has the same text in both versions. To save a file, click the link, or right-click it and choose "Download Linked File" or "Save Link As".

| Reading | Course date | Size | Rough tokens | Download |
|---|---|---|---|---|
| Plato, *Phaedrus*, tr. Benjamin Jowett (Gutenberg [#1636](https://www.gutenberg.org/ebooks/1636)) | Oct 6 | 212 KB | ~50,000 | [.txt](/workshop/texts/plato-phaedrus.txt) · [.md](/workshop/texts/plato-phaedrus.md) |
| Karel Čapek, *R.U.R.*, tr. Paul Selver and Nigel Playfair, 1923 (Gutenberg [#59112](https://www.gutenberg.org/ebooks/59112)) | Sept 29 | 129 KB | ~30,000 | [.txt](/workshop/texts/capek-rur.txt) · [.md](/workshop/texts/capek-rur.md) |
| Mary Shelley, *Frankenstein*, 1818 text (Gutenberg [#41445](https://www.gutenberg.org/ebooks/41445)) | Sept 15 | 409 KB | ~95,000 | [.txt](/workshop/texts/shelley-frankenstein-1818.txt) · [.md](/workshop/texts/shelley-frankenstein-1818.md) |
| Henri Bergson, *Laughter*, tr. Cloudesley Brereton and Fred Rothwell, 1911 (Gutenberg [#4352](https://www.gutenberg.org/ebooks/4352)) | Sept 29 | 229 KB | ~50,000 | [.txt](/workshop/texts/bergson-laughter.txt) · [.md](/workshop/texts/bergson-laughter.md) |
| Oscar Wilde, *The Picture of Dorian Gray*, 1891 (Gutenberg [#174](https://www.gutenberg.org/ebooks/174)) | Sept 22 | 437 KB | ~105,000 | [.txt](/workshop/texts/wilde-picture-of-dorian-gray-1891.txt) · [.md](/workshop/texts/wilde-picture-of-dorian-gray-1891.md) |
| Oscar Wilde, *Intentions* (includes *The Critic as Artist*), 1913 Methuen text (Gutenberg [#887](https://www.gutenberg.org/ebooks/887)) | Sept 22 | 332 KB | ~75,000 | [.txt](/workshop/texts/wilde-intentions.txt) · [.md](/workshop/texts/wilde-intentions.md) |

"Rough tokens" is the word count times 1.3, a common rule of thumb for English. Claude's own count will differ.

## Choosing what to upload

- **Start with one text, or two short ones.** On a free plan, all of a project's files must fit in the model's context window together, so the two longest novels together may not fit. On a paid plan, Claude switches to searching the files once they get large (see [Under the hood](/workshop/claude-desktop#under-the-hood-what-the-files-do)).
- **A part can work better than the whole.** If your bot only needs a few chapters (the creature's own story in *Frankenstein*, say), copy them into a new text file and upload just that. A smaller file is easier to check answers against, too. Note that this 1818 text numbers its chapters within each of three volumes, so its chapter numbers won't match an edition that numbers them straight through.
- **The *Phaedrus* file starts with Jowett's long introduction** before Plato's dialogue. A bot built on it may answer from Jowett's summary rather than from Plato. The [/retrieval](/retrieval) page shows this happening.
- **Translations are their translators' words.** A Socrates built on Jowett speaks Jowett's Victorian English.

## Where these come from

Each file is a Project Gutenberg ebook, cleaned into Markdown for the course. The few lines at the top of each file, between the `---` markers, record its title, author, translator, edition, and Gutenberg number. Leave them in: they tell Claude, and anyone who opens the file, what the text is. Project Gutenberg lists all six as "Public domain in the USA" (checked on each ebook's page on 2026-10-20). They are the same six texts that the [/retrieval](/retrieval) page searches.

Only public-domain texts are offered here, because this folder is served openly. For the other readings (Grice, Sacks, Schegloff, and Jefferson, Shanahan et al., and the AI papers), use the copies your instructors share with you, and keep them in your own project.
