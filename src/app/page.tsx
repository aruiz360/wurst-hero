"use client";

import mapJson from "@/data/map.json";
import heroJson from "@/data/heros/andy.json";

import { useMemo, useState } from "react";
import Link from "next/link";
import { renderPaths, renderNextNodes } from "@/utils/map";
import { getNodeById } from "@/utils/nodes";
import { renderInteractions } from "@/utils/interactions";
import { renderLocalizedText } from "@/utils/localizedText";

function createInitialGame(): GameState {
  const currentNode = 1;
  const map = mapJson as MapData;
  const hero = heroJson as Hero;

  return {
    currentNode,
    map,
    hero,
  };
}

export default function Home() {
  const initialGame = useMemo(() => createInitialGame(), []);
  const [game, setGame] = useState(initialGame);
  const currentNodeData = useMemo(
    () => getNodeById(game.currentNode),
    [game.currentNode]
  );

  return (
    <div className="flex min-h-screen justify-center bg-background text-foreground">
      <main className="w-full max-w-4xl p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold">Wurst Hero</h1>
          <Link href={"grid"} className="mt-3 inline-block text-sm underline">
            View grid prototype
          </Link>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded border border-foreground/10 bg-foreground/5 p-4">
            <h2 className="text-lg font-bold">Map</h2>
            Name: {game.map.name} <br />
            Start node: {game.map.startNodeId} <br />
            All Nodes: {game.map.nodeIds?.join(", ")}
            All paths: {renderPaths(game.map.paths)}
          </div>

          <div className="rounded border border-foreground/10 bg-foreground/5 p-4">
            <h2 className="text-lg font-bold">Hero</h2>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 text-sm font-semibold">
                {game.hero.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              {game.hero.name} ({game.hero.gender})
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-1 my-4">
          <div className="rounded border border-foreground/10 bg-foreground/5 p-4">
            <h2 className="text-lg font-bold">Navigation</h2>
            Current Node: #{game.currentNode} <br />
            Node Title: {renderLocalizedText(currentNodeData?.title)}
            Node Description: {renderLocalizedText(currentNodeData?.description)}
            Next possible nodes:{" "}
            {renderNextNodes(game.currentNode, game.map.paths, (nodeId) => {
              setGame((prev) => ({
                ...prev,
                currentNode: nodeId,
              }));
            })}
          </div>

          <div className="rounded border border-foreground/10 bg-foreground/5 p-4">
            <h2 className="text-lg font-bold">Interactions</h2>
            { renderInteractions(currentNodeData?.interactions) }
          </div>
        </section>
      </main>
    </div>
  );
}
