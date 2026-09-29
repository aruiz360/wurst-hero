# Wurst Hero

A story-driven game for learning German by living through everyday situations: catching the bus,
ordering at the bakery, asking for directions. You play a hero moving across a map of real-life
scenes, and you progress by responding the way a local would.

Built with **React 19** on **Next.js 16**, using TypeScript, Tailwind CSS, and Three.js.

> Status: early prototype. The data model, a text-based game loop, and a 3D map experiment exist.
> Most of the game (progression, scoring, visuals) is still ahead.

## Vision

Most language apps teach vocabulary in isolation. Wurst Hero teaches it **in context**: every word
and phrase is attached to a situation you would actually face after moving to a German-speaking
country.

- **A map of situations.** The world is a graph of nodes (a bus stop, a bakery, a doctor's office)
  connected by paths. You choose where to go next, and each node is a small, self-contained scene.
- **Dialogue as gameplay.** Inside a node, characters speak and you reply. Your answer is compared
  with what a native speaker would plausibly say, and you get feedback plus a short grammar or
  culture explanation.
- **Two levels per interaction.** `level_1` is the minimum that works ("Ist das der Bus Nummer
  fünf?"). `level_2` is the more natural, polite form ("Entschuldigung, ist das der Bus Nummer
  fünf?"). Players start by surviving and gradually learn to sound fluent.
- **CEFR-aligned progression.** Content is tagged by difficulty (starting at A1). Completing nodes
  unlocks new areas of the map and grows a vocabulary inventory.
- **Bilingual by design.** All content is authored in English and German side by side, so it can be
  shown as translation, hint, or target text depending on the player's level.
- **A 3D world, eventually.** The map will be rendered as an explorable 3D grid (Three.js), with
  the hero moving between node positions.

## Stack

Wurst Hero is a **React** application. All UI (game screens, interactions, the 3D scene wrapper)
is written as React function components with hooks (`useState`, `useMemo`, `useEffect`,
`useRef`), and Next.js provides routing, bundling, and the dev server on top of React.

| Layer      | Choice                                                      |
| ---------- | ----------------------------------------------------------- |
| Framework  | [Next.js 16](https://nextjs.org) (App Router)               |
| UI         | **[React 19](https://react.dev)** (function components + hooks) |
| Language   | TypeScript 5 (strict)                                       |
| Styling    | [Tailwind CSS 4](https://tailwindcss.com) via PostCSS       |
| 3D         | [Three.js](https://threejs.org) 0.182                       |
| Content    | Static JSON files, imported at build time                   |
| Tooling    | ESLint 9 (`eslint-config-next`), Prettier, EditorConfig     |

There is no backend or database yet. All game content ships as JSON in the bundle and game state
lives in React state.

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Then open:

- [http://localhost:3000](http://localhost:3000): the text prototype (map, hero, navigation,
  interactions)
- [http://localhost:3000/grid](http://localhost:3000/grid): the 3D grid prototype

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```

## Project structure

```
@types/                     Global ambient types (no imports needed)
  common.d.ts               LocalizedText { en, de }
  game-state.d.ts           GameState { map, hero, currentNode }
  hero.d.ts                 Hero
  interaction.d.ts          Interaction, InteractionLevel, InteractionReaction
  map-data.d.ts             MapData
  map-node.d.ts             MapNode
  map-path.d.ts             MapPath
src/
  app/
    page.tsx                Text prototype: game state, navigation, interactions
    grid/page.tsx           3D grid prototype page
    layout.tsx, globals.css
  components/
    grid.tsx                Three.js scene: grid, clickable points, hero marker
    interaction.tsx         Renders one interaction (level 1 / level 2 + reactions)
    interaction-response.tsx  Answer input + similarity scoring
  data/
    map.json                Map: node ids and paths between them
    game_initializer.json   Planned initial game/progress state (not wired in yet)
    heros/andy.json         Hero definition
    nodes/node_XXX_*.json   One file per map node (situation)
  utils/
    map.tsx                 Path rendering, next-node lookup
    nodes.ts                Node registry (id -> MapNode)
    interactions.tsx        Interaction list rendering
    localizedText.tsx       Renders LocalizedText in all languages
```

## Content model

The game is data-driven. Writing content means writing JSON; the TypeScript types in `@types/`
describe the shape.

### Map

```json
{
  "id": 1,
  "name": "Demo Map",
  "startNodeId": 1,
  "nodeIds": [1, 2, 3],
  "paths": [{ "from": 1, "to": 2 }, { "from": 2, "to": 3 }]
}
```

Paths are directed. From the current node, the player can move to any node reachable by a path
whose `from` matches. A node with no outgoing paths is an end point.

### Node

```json
{
  "id": 2,
  "type": "SITUATION",
  "title": { "en": "The Bus", "de": "Der Bus" },
  "description": { "en": "...", "de": "..." },
  "interactions": [ ... ],
  "render": { "position": { "x": 0, "y": 0 } }
}
```

- `type`: `START` (spawn point, no interactions) or `SITUATION`.
- `render.position`: where the node sits on the map grid.

### Interaction

Each node holds an ordered list of interactions, played as steps:

```json
{
  "type": "character",
  "character": "hero",
  "level_1": {
    "action": { "en": "Is this bus number five?", "de": "Ist das der Bus Nummer fünf?" },
    "possible_reactions": [
      {
        "text": { "en": "Yes, it is.", "de": "Ja, das ist er." },
        "explanation": {
          "en": "The pronoun 'er' refers to 'der Bus' (masculine).",
          "de": "Das Pronomen „er“ bezieht sich auf „der Bus“ (maskulin)."
        }
      }
    ]
  },
  "level_2": { ... }
}
```

- `type: "context"`: narration that sets the scene (`character` is `null`).
- `type: "character"`: a line spoken by a character (`"hero"` or an NPC).
- `level_1` is required, `level_2` is optional.
- `possible_reactions` lists acceptable replies, each with an `explanation` that teaches the
  grammar or cultural point behind it.

### Adding a new situation

1. Create `src/data/nodes/node_004_<name>.json` following the node shape above.
2. Register it in `src/utils/nodes.ts`.
3. Add its id to `nodeIds` and connect it with `paths` in `src/data/map.json`.

## How it works today

**Text prototype (`/`).** Loads the map and hero from JSON into React state, starting at node 1.
Shows the current node, its interactions, and links to the next reachable nodes. Each interaction
has an input where the player types a reply; `interaction-response.tsx` scores it against the
expected reactions with a simple character-by-character similarity:

- ≥ 0.8 match with a level 2 reaction: "Great! Very close to level 2."
- ≥ 0.5 match with a level 1 reaction: "Good! Close to level 1."
- otherwise: "Needs work."

**3D grid prototype (`/grid`).** A Three.js scene with a 100×100 grid, a clickable point at every
intersection (raycasting logs the selected point), and a red cylinder as a placeholder hero marker.
It is not yet connected to map data.

## Known limitations

- Answers are scored against the **English** reaction text (`reaction.text.en`), not German.
- Similarity is a naive positional character match; word order or a single missing letter early in
  the sentence ruins the score. Candidates: Levenshtein distance, token overlap, or an LLM-based
  evaluator for free-form answers.
- Nodes must be registered manually in `src/utils/nodes.ts`.
- `game_initializer.json` (difficulty, visited/unlocked/completed nodes, vocabulary inventory) is
  not used yet.
- The 3D grid does not render the map's nodes or paths, and point selection only logs to the
  console.
- No persistence: refreshing the page resets progress.
- `layout.tsx` still has the default Create Next App metadata.

## Roadmap

- [ ] Score answers in German and use a tolerant matching algorithm
- [ ] Wire `game_initializer.json` into game state (progress, unlocks, difficulty)
- [ ] Render map nodes and paths on the 3D grid; move the hero between them
- [ ] Vocabulary inventory collected from completed interactions
- [ ] Save progress (localStorage first, backend later)
- [ ] More situations: supermarket, doctor, Bürgeramt, train station
- [ ] Language toggle to hide the translation as the player advances

## Code style

Prettier (`.prettierrc`): double quotes, semicolons, trailing commas (ES5), 100-char lines, 2-space
indent. EditorConfig enforces LF line endings and a final newline.
