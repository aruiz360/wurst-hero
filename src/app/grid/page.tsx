"use client";

import Link from "next/link";
import Grid from "@/components/grid";

export default function Home() {
  return (
    <div className="flex min-h-screen items-top justify-center bg-background text-foreground">
      <main className="w-100 text-center mb-6 fixed z-10">
        <header>
          <h1 className="text-3xl font-semibold">Wurst Hero</h1>
          <Link href={"/"} className="mt-3 inline-block text-sm underline">
            Back to main
          </Link>
        </header>
      </main>

      <Grid />
    </div>
  );
}
