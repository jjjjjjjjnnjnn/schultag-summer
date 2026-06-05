# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**异乡校园：夏天 (Schultag: Summer)** — An indie narrative game where the player is Robert, a Chinese international student at a German boarding school. The core loop is: **observe → collect notes → write**. Inspired by *Florence* and *Life is Strange*, not traditional visual novels.

Novel source material lives in `../novel/` (33 Markdown files converted from the author's docx).

## Commands

```bash
cd campus-game
npm run dev        # Vite dev server (localhost:5173, HMR)
npm run build      # tsc -b && vite build → dist/
npm run lint       # eslint
npm run preview    # serve production build locally
```

TypeScript strict mode with `noUnusedLocals`, `noUnusedParameters`. The build **will not succeed** if there are unused imports or variables.

## Architecture

### Scene Model

The game has two scene types defined in `src/types/game.ts`:

- **DayScene**: `intro` (scripted dialogue) → **observation phase** (player picks from clickable `ObservationPoint[]`) → `outro` (scripted closure). Transitions to next scene via `nextSceneId`.
- **NightScene**: scripted `lines` → optional **writingPhase** where the player selects `NotebookEntry` items from their collection and the system matches them against `WritingRecipe[]` to compose a passage.

Scene flow is linear between scenes but **non-linear within a scene** — the player chooses what to observe and which notes to combine.

### State (`src/store/gameStore.ts`)

Single Zustand store manages everything. Key state:

- `currentSceneId` / `currentLineIndex` — position in scene script
- `isExploring` — true during observation phase of a DayScene
- `observedIds` — which observation points have been clicked
- `selectedEntryIds` — which notebook entries are checked for writing
- `notebook` — accumulated `NotebookEntry[]` across all days
- `writings` — composed passages from writing phases
- `relationships` — per-character affinity (modified by observation effects)

`advanceLine()` has special logic: when `isExploring` is true and intro is done, it stops advancing (observation panel takes over). `finishExploring()` resets `currentLineIndex` to `intro.length` so outro starts from the beginning.

### Data (`src/data/`)

- `characters.ts` — 4 characters: Robert (protagonist), Ludwig, Maya, teacher
- `chapters.ts` — scene definitions with full dialogue, observation points, and writing recipes

To add a new chapter: define a `DayScene` + `NightScene` pair in `chapters.ts` with observations and recipes, then wire `nextSceneId` from the previous scene.

### UI Layout (`src/scenes/GameScreen.tsx`)

Desktop: left sidebar (character relationships) + center (SceneView or NotebookView). Top bar shows mode (day/night), observation count, notebook toggle. The game determines day/night from the current scene's `mode` property, not a separate toggle.

## Conventions

- Chinese-language game text. All UI labels, dialogue, and narration are in Simplified Chinese.
- Character colors: Robert `#d97706`, Ludwig `#3b82f6`, Maya `#8b5cf6`, teacher `#6b7280`.
- Tailwind CSS v4 with custom theme vars in `src/index.css` (`--color-game-*`, `--font-*-cn`).
- Notebook entries use `.notebook-paper` CSS class (lined paper texture).
- `useTypewriter` hook: 35ms per character for dialogue, skip on click.

## File Map

| Purpose | Path |
|---------|------|
| Type definitions | `src/types/game.ts` |
| Game state + logic | `src/store/gameStore.ts` |
| Scene data (dialogue + observations + recipes) | `src/data/chapters.ts` |
| Character data | `src/data/characters.ts` |
| Scene rendering (day/night/writing UI) | `src/components/ui/SceneView.tsx` |
| Dialogue line rendering | `src/components/ui/DialogBox.tsx` |
| Notebook panel | `src/components/ui/NotebookView.tsx` |
| Game chrome (sidebar, topbar, menu) | `src/scenes/GameScreen.tsx` |
| Title screen | `src/scenes/TitleScreen.tsx` |
