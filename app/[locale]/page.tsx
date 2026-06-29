import { redirect } from "next/navigation";

// [locale]/ → redirect to dashboard (middleware handles locale prefix)
export default function LocaleRootPage() {
  redirect("/dashboard");
}
