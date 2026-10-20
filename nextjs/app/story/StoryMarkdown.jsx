import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { resolveMarkdownHref } from "../../lib/content.mjs";

// A step's prose. Relative links resolve from content/story/; a link into the glossary shows the entry's one-line
// definition on hover (title) and is marked as a glossary term. `print`: outside links print their address.
export default function StoryMarkdown({ markdown, glossary = {}, print = false }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children }) => {
          const resolved = resolveMarkdownHref(href, "story");
          const entry = glossary[resolved.split("#")[0]];
          const external = /^https?:\/\//i.test(resolved);
          if (print) return <a href={resolved}>{children}{external && typeof children === "string" && children !== resolved ? <span className="print-url"> ({resolved})</span> : null}</a>;
          if (entry) return <a href={resolved} className="gloss" title={`${entry.term}: ${entry.short}`}>{children}</a>;
          return <a href={resolved} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>{children}</a>;
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
