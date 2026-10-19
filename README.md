# Cosmere & Beyond — Brandon Sanderson Book Timeline

**Live site: [cosmere-timeline.vercel.app](https://cosmere-timeline.vercel.app)**

An interactive timeline of every Brandon Sanderson book — 104 works spanning the Cosmere
(Mistborn, The Stormlight Archive, Elantris, Warbreaker, the Secret Projects), the Cytoverse
(Skyward, Riftwake), The Reckoners, Alcatraz, the Wheel of Time conclusions, and every
announced upcoming release, including books we only know by title.

## Features

- **Chronological timeline** of all releases, opening centered on the most recent book —
  scroll forward for upcoming releases, back through the whole catalog
- **Announced & unscheduled books** included with honest `TBD` markers (Ghostbloods trilogy,
  Stormlight 6, Elantris sequels, The Aztlanian, and more)
- **Recommended Cosmere reading path** grouped into arcs (Mistborn Era 1 → Stormlight Begins →
  … → Secret Projects & Beyond)
- **Book detail cards** with a full synopsis, Goodreads rating, and links to Coppermind,
  Goodreads, Amazon, and Audible
- **Series filters**, personal **Read / TBR tracking** (stored locally in IndexedDB),
  **dark mode**, **keyboard navigation** (arrow keys / Escape), and a fully responsive
  **vertical timeline on mobile** with a floating filter menu
- **SEO/LLM-friendly**: JSON-LD structured data (Book ItemList + FAQ), crawlable no-JS
  book index, Open Graph tags, sitemap, and self-hosted fonts

## Stack

React 18 + TypeScript + Vite, Tailwind CSS, Motion (framer-motion), idb-keyval,
Fontsource. Deployed on Vercel; SEO content is regenerated from `src/data/books.ts`
on every build (`scripts/generate-seo.mjs`).

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # regenerates SEO block + production build
npm run lint
```

Book data lives in `src/data/books.ts`; series filters and the reading-path arcs in
`src/data/filters.ts`.

## License

The code in this repository is released under the [MIT License](LICENSE).

The Cosmere, its books, characters and related names are the property of Brandon
Sanderson and Dragonsteel Entertainment. This is an unofficial fan project and is
not affiliated with or endorsed by them.
