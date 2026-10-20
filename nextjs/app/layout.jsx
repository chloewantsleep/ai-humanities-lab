import "@fontsource-variable/inter";
import { EB_Garamond, Josefin_Sans, Jost } from "next/font/google";
import "./globals.css";

// Jost and EB Garamond come from the Poetry Gem (eng-298ai-mw); Josefin Sans is a heavier stand-in for its art-deco
// Poiret One (which has one thin weight); Inter is from the timeline.
const deco = Josefin_Sans({ weight: ["600", "700"], subsets: ["latin"], variable: "--font-deco-display", display: "swap" });
const jost = Jost({ subsets: ["latin"], variable: "--font-jost", display: "swap" });
const garamond = EB_Garamond({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-garamond", display: "swap" });

export const metadata = {
  title: { default: "Chatbot Experiments", template: "%s · Chatbot Experiments" },
  description: "Prototypes for ENG 298AI: how the chatbot assistant was made, from base model to agent.",
};

export const viewport = {
  colorScheme: "dark",
  themeColor: "#2a2225",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${deco.variable} ${jost.variable} ${garamond.variable}`}>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
