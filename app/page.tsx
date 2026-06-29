import { redirect } from "next/navigation";
import { DEFAULT_ISTAT } from "@/lib/content";

// Home → analisi del comune di default (predisposto multi-comune).
export default function Home() {
  redirect(`/${DEFAULT_ISTAT}`);
}
