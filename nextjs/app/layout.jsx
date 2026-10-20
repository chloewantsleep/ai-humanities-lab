import "@fontsource-variable/inter";
import "./globals.css";

export const metadata = {
  title: { default: "Chatbot Experiments", template: "%s · Chatbot Experiments" },
  description: "Prototypes for ENG 298AI: how the chatbot assistant was made, from base model to agent.",
};

export const viewport = {
  colorScheme: "dark",
  themeColor: "#121412",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
