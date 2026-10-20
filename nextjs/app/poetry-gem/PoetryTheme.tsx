import type { ReactNode } from "react";
import s from "./theme.module.css";

export default function PoetryTheme({ children }: { children: ReactNode }) {
  return <div className={`${s.theme} gem-classic`}>{children}</div>;
}
