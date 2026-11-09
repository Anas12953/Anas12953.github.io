# Anas Yasser portfolio

Published at https://anas12953.github.io/. Registration of anas.thedev.id is separate; the site does not claim that domain is active.

Static multi-page HTML, CSS and native JavaScript modules. No third-party runtime dependencies, production source maps, analytics or backend services.

## Structure

- `index.html`: portrait-led home, scroll-driven CSS 3D idea scene, selected work, journey and current direction.
- `about/`, `projects/`, `projects/*/`, `contact/`: original portfolio with refinements and real screenshots.
- `journey/`: school and robotics story, filterable certificate slots.
- `resources/`: learning reference shelf.
- `play/`: optional keyboard/touch rover project explorer.
- `ar/`: Arabic introduction. Detailed project pages remain English.
- `404.html`: direct navigation plus a robot-delivery puzzle.
- `premium.css`, `js/premium.js`: clay accent, decoding text, tactile surface, scroll index, paper transitions, screenshot dialog and certificate filtering.
- `js/world.js`: lazy scroll-driven 3D scene; no WebGL dependency.
- `js/pages/play.js`, `js/pages/notfound.js`, `js/game-state.js`: game UI and testable movement rules.
- `assets/anas-ability-card.svg`: downloadable identity card.
- `scripts/verify.py`, `scripts/bundle-report.py`, `tests/`: local validation.

Run `npm test` and `npm run report`. `npm run dev` serves the site locally. No install step is needed. GitHub Pages serves the root directly.

## Seven interactions

1. Decode-in headlines and editorial labels, with stable accessible labels.
2. Scroll-synced project index; horizontal on narrow screens, compatible with category filtering.
3. Tactile embossed identity surface on About, driven by pointer position.
4. Playable 404 delivery puzzle with keyboard and on-screen controls.
5. Live CSS 3D scene on Home with scroll-driven rotation, depth and three chapters.
6. Playable rover project explorer, with direct marker selection and normal project navigation.
7. Scroll-linked paper reveal with a torn edge and accent-colored heading.

Motion preference and device reduced-motion settings disable decorative movement; core content remains readable without JavaScript. Sound is off by default and must be enabled separately on each page. No background loops are added.

## Pending owner material

- Original certificate scans, accurate titles, issuers and dates. Four reserved slots are explicitly marked scan pending. Only the previously reported Best Presentation award is named.
- Project recordings for video previews. Existing screenshots are real; enlarge them from case-study pages. No fake project recordings or endorsements are added.
- Approved teacher feedback if a testimonial section is desired.
- Full Arabic project translations. The current Arabic page is an introduction, clearly labeled.

## Release validation

20 HTML pages: unique titles/descriptions, one H1 each, canonical and social metadata, JSON-LD, valid local assets/links/anchors and JavaScript syntax. Logic tests cover map bounds, nearest-stop selection and puzzle collisions/completion. Browser QA covers desktop and 390px layouts, certificate filters, project selection, puzzle completion, dialogs, motion and the existing lamp. Bundle measurements are recorded in `bundle-report.json`; gzip is a local estimate, not a network measurement.
