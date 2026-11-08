# Portfolio project reference

Use this guide as the source map before changing the live portfolio. Preserve the existing visual system, navigation behavior, responsive layouts, and fallback behavior; make focused changes and verify with the build.

## Stack and commands

- This is a single-page React 19 app written in TypeScript, built and served by Vite 8. `src/main.tsx` mounts `App` in React `StrictMode`; `index.html` is the Vite entry document.
- npm is the package manager (`package-lock.json`, lockfile v3). Install with `npm install`; run locally with `npm run dev`; build with `npm run build` (TypeScript project build, then `vite build`); preview with `npm run preview`; lint with `npm run lint` (oxlint).
- Tailwind CSS 4 and its Vite plugin are installed and `src/index.css` imports Tailwind, but the site's layout and visual design are authored as regular CSS there; do not assume utility classes define existing components.
- Lenis provides smooth scrolling. Lucide React and React Icons provide icons. GSAP is installed but is not imported by the application; current motion is implemented with CSS, browser APIs, and Lenis.
- No test script or test files are present in the project manifest/source inventory.

## File and folder map

- `index.html` — document metadata, favicon, theme color, app root, and `src/main.tsx` script.
- `src/main.tsx` — React root and global stylesheet import.
- `src/App.tsx` — all page content, project/capability data, page components, and interaction logic; this is currently the only application TSX file.
- `src/index.css` — global reset/tokens and all desktop, mobile, animation, and component styles.
- `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg` — local assets; none is currently imported by the app.
- `public/images/finance-app.png`, `kulinarya.png`, `my-img.png`, `translate-app.png`, `typetest-app.png` — public project art and portrait, addressed by URL.
- `public/favicon.svg` — document favicon (large SVG with embedded image data); `public/icons.svg` — SVG symbol sprite. The app currently uses React icon libraries rather than the sprite.
- `README.md` — project overview and basic run/build commands.
- `package.json` / `package-lock.json` — scripts and dependencies / pinned dependency resolution.
- `vite.config.ts` — React and Tailwind Vite plugins.
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` — TypeScript project references and app/config compiler settings.
- `.oxlintrc.json` — Oxlint plugins and rules. `.gitignore` — generated/dependency/editor exclusions. `.vscode/tasks.json` — `dev` task exposing Vite on `0.0.0.0`.
- `src/components/`, `src/hooks/`, `src/sections/`, `src/styles/`, `src/assets/fonts/`, `src/assets/icons/`, `src/assets/images/`, and `public/documents/`, `public/fonts/`, `public/icons/` currently contain no tracked files. Add to these only when the architecture calls for it; current app code/styles are centralized in `App.tsx` and `index.css`.
- Treat `node_modules/`, `dist/`, and `.git/` as dependency/build/version-control output, not application source.

## Pages, sections, and navigation

- The home page is one document in this order: `#home` hero, `#about` introduction, `#skills` capabilities, `#projects` selected work, `#contact` contact CTA and footer.
- A separate About view is rendered at pathname `/about` (no router); its sections are portrait/intro, work timeline, certifications, off-screen interests, and closing contact/home actions.
- Desktop uses a fixed rotated side navigation; mobile uses the header menu. Both are generated from `navigation` in `src/App.tsx`. HOME and section links use hash anchors; ABOUT changes the pathname to `/about`; CONTACT opens the contact card rather than scrolling to the `#contact` section.
- `SmoothHashNavigation` delegates same-page hash-link clicks and scrolls through Lenis; it pushes the hash into browser history. The `AppContent` handlers manage `/about`, `#contact-card`, and `popstate`. The contact card closes by going back in history, by Escape, or by clicking/touching the overlay.
- Preserve section IDs and their matching links. Do not introduce a router or alter history semantics without updating both desktop and mobile navigation and the close/back behavior.

## Design system and component styling

- Global tokens in `src/index.css` `:root`: `--black: #101010`, `--white: #f4f4f1`, `--gray: #848480`, `--line: rgba(244,244,241,.22)`, `--gutter: clamp(22px,6.25vw,100px)`, spacing tokens `--space-xs`/`--space-sm`/`--space-md` (8/12/16px), `--type-micro`/`--type-label` (8/10px), `--radius-round` (50%), and `--ease: cubic-bezier(.22,1,.36,1)`. Page background/text are `#101010` / `#f4f4f1`; dark color scheme is enabled.
- Other recurring shades include `#aaa`/`#a6a6a1`/`#999994` for supporting copy, `#111` for the contact card, and pale gray project-art surfaces. The SVG sprite contains purple `#aa3bff` symbols, but it is not currently used by the app.
- The default typography is `"SFMono-Regular", Consolas, "Liberation Mono", monospace`; long-form prose selectively uses `Arial, Helvetica, sans-serif`. No custom font files are currently used. Eyebrows, labels, and metadata are typically 8–10px; body copy is about 10–16px; titles use responsive `clamp()` sizing and heavy weights (800–900). Tight display line heights and outlined headline spans are intentional.
- Spacing is largely responsive/hardcoded rather than a full scale: shared page gutter and small 8/12/16px spacing tokens above; content offsets commonly `9.2vw`, section margins/padding use `vh`, and other gaps/padding use px or `clamp()`. Keep the desktop offsets and mobile overrides coordinated.
- Borders are mostly 1px `--line`; cards are generally square-cornered. Circular motifs use `border-radius: 50%` (stamp, CTA icon, project art details). Shadows are sparse and mostly hover/cursor glows; the contact dialog uses `0 34px 100px rgba(0,0,0,.55)`.
- Layout uses CSS Grid/Flexbox: hero and contact are flex layouts, capabilities and timeline are grids, project cards use a two-column grid on desktop, and the footer uses a four-column grid. The about page uses a two-column intro/certification panel and three-column timeline/personality layouts.
- Buttons/links are generally text-led and transparent with understated borders; hover states add glow, movement, or inverse colors. Capability rows are full-width button accordions. Project cards are full-card external links. Contact is a centered overlay/dialog with close button, email, and social links; there is no data-submission form.
- Icons use `lucide-react` for interface arrows/close and `react-icons` for brand/social/technology icons. Project and portrait images are public PNGs: project art uses `object-fit: contain`, portrait uses `object-fit: cover`. Keep descriptive image `alt` text.
- CSS is organized in one stylesheet, generally by component/section, with responsive and reduced-motion rules later in the file. Class names are descriptive kebab-case; this is not a BEM or utility-first codebase.

## Page interactions and behavior

- `ReactLenis` in `AppContent` configures root smooth scrolling (`lerp: 0.075`, `wheelMultiplier: 0.9`, `smoothWheel: true`, touch sync off). `ScrollProgress` maps Lenis progress to the fixed 2px top bar.
- `Reveal` and `MotionSection` use `IntersectionObserver` to apply `.is-in` / `.section-in-view` once visible; CSS handles fades, translate/scale reveals, and headline flicker.
- `CustomCursor` activates only for `(pointer: fine)`, follows the pointer with a requestAnimationFrame spring, snaps to links/buttons/project cards/skill rows, and adds decoration classes. CSS hides the native cursor only while enabled; mobile hides this cursor.
- Capability rows use `activeCapability` for a single-open accordion. `TechnologyMarquee` repeats each technology list eight times and scrolls it with CSS.
- `ContactCard` stops Lenis while open, and resumes it on cleanup. Overlay click/touch, close button, and Escape/history navigation close it. External social/certification/project links open new tabs with `rel="noreferrer"`; email uses `mailto:`.
- CSS provides hover transitions, project image/fallback ornament motion, mobile menu animation, dialog fade/expand, and `prefers-reduced-motion` overrides. Preserve the reduced-motion behavior when adding animations.

## Responsive behavior

- Breakpoints: `min-width: 1600px` caps the hero title at 250px; `761px–1159px` fluidly sizes the About page title to keep it within the viewport; `max-width: 760px` switches to the mobile header/menu and single-column layouts; `max-width: 370px` further reduces hero/contact title sizing. A `prefers-reduced-motion: reduce` block disables or minimizes transitions/animations and reveals content directly.
- At 760px and below, the gutter becomes 23px, side navigation and header metadata disappear, the hamburger menu appears, project cards stack, about/timeline/personality/certification layouts become one column, and footer/dialog geometry is reworked for small screens.
- Check both `/` and `/about` at desktop and mobile widths when changing shared layout rules. The site sets a 320px body minimum width.

## Project-card pattern (copy this for each new project)

- Add one object to the `projects` array in `src/App.tsx`, following the existing fields and types:

  ```ts
  { name: 'Project name', category: 'CATEGORY', year: '2026', image: 'image-basename', href: 'https://project.example/', fallback: 'SHORT LINE\nSECOND LINE' }
  ```

- Add the matching file as `public/images/image-basename.png`. The key is `project.image`; `ProjectCard` builds `/images/${project.image}.png`, uses `alt="${project.name} application"`, lazy-loads it, and hides the image on load error so the always-rendered fallback remains visible. Keep `image` unique because it is also the React key and dynamic card class suffix.
- `ProjectCard` renders the whole card as an external anchor (`target="_blank"`, `rel="noreferrer"`). It layers fallback copy/ordinal, the image, and an arrow affordance inside `.project-art`, then displays ordinal/category, name, and year. The array order determines displayed ordinal and layout order.
- Keep each field meaningful: `category` is the uppercase type label, `year` is a string, `href` is the project URL, and `fallback` uses a newline for its deliberate two-line display. No separate project-data file or CMS exists.

## Conventions and fragile areas

- Keep page data and small helper components near their consumers in `src/App.tsx`; current capability/project content is static typed data rendered with `.map()`. Use semantic HTML, typed props, React hooks, and accessible labels/states (`aria-expanded`, dialog labels, image alt).
- Match existing style: two-space TS/TSX indentation, single-quoted TypeScript strings, semicolon-light TS/TSX, and compact hand-authored CSS. Keep new styles scoped to their component classes rather than broad element selectors.
- `src/index.css` is global and owns nearly all layout/animation behavior; changes to root rules, `body`, shared `.section-shell`, `.reveal`, or shared typography can affect both pages. Check hover, focus, mobile, and reduced-motion states after touching it.
- Navigation depends on exact IDs/paths, `window.history.pushState` plus `popstate`, and a root-mounted Lenis instance. `/about` is client-rendered without a router; production direct visits to `/about` require the hosting platform to serve the SPA entry document.
- Project asset URLs and names are convention-based. Keep the matching PNG in `public/images/`; the `onError` fallback is intentional and should not be removed.
- Cursor, menu, and dialog effects toggle global document classes and Lenis scrolling. Keep event listeners/observers cleaned up in effects, and avoid leaving page scroll locked after close/unmount.
- The project list's displayed ordinal is derived from its array index. The `.project-two` / `.project-three` CSS rules have no matching class in current `ProjectCard` markup; do not rely on them for new project layouts without wiring them deliberately.
- There are no current component, hook, section, or style modules in their corresponding empty folders. Avoid duplicating the existing centralized implementation accidentally when adding files.

## Open questions (not inferred)

- Which production host serves this site, and does it rewrite direct `/about` requests to `index.html`?
- Are `src/assets/hero.png`, `src/assets/react.svg`, and `src/assets/vite.svg` intentionally retained, or are they unused starter assets?
