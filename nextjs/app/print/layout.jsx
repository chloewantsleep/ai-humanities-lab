// Print pages: black ink on white, no chrome, tuned for Letter paper.
export const metadata = { title: { default: "Print · Chatbot Experiments", template: "%s · Print · Chatbot Experiments" } };

export default function PrintLayout({ children }) {
  return <div className="print-root">{children}</div>;
}
