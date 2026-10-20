import { redirect } from "next/navigation";

// "Today" used to live here (content/workshop/README.md); it is now the home page.
export default function Workshop() {
  redirect("/");
}
