import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import MobileHeader from "@/components/MobileHeader";
import "@/styles/globals.css";
import Link from "next/link";


export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const path = router.pathname;

  const isSimpleLayout = path === "/";

  return isSimpleLayout ? (
    <Component {...pageProps} />
  ) : (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden">
      <MobileHeader />
      <aside className="hidden md:flex w-[240px] bg-[#2b362c] text-white p-6 flex-col gap-4">
        <h1 className="text-xl font-bold mb-8">BRIDGE</h1>
        <nav className="flex flex-col gap-4">
          <Link href="./new" className="hover:underline">New Patient</Link>
          <Link href="./follow-up" className="hover:underline">Follow-up</Link>
          <Link href="./db" className="hover:underline">Database</Link>
          <Link href="./clinical-photo" className="hover:underline">Clinical Photo</Link>
        </nav>
      </aside>
      <main className="flex-1 bg-[#f5f5f5] p-8 overflow-auto">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
