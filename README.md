# hades.dev

A responsive React and TypeScript portfolio built with Vite, Tailwind CSS, and Lenis.

## Development

```sh
npm install
npm run dev
npm run lint
npm run build
```

## Structure

- `src/components/` reusable interface components
- `src/hooks/` shared React hooks
- `src/sections/` page sections
- `src/styles/` additional style modules
- `src/assets/images/`, `src/assets/icons/`, `src/assets/fonts/` imported source assets
- `public/images/`, `public/icons/`, `public/fonts/`, `public/documents/` files served as-is

Keep the page inside the root `ReactLenis` provider in `src/App.tsx`; this makes smooth scrolling available to all sections and future content. For new scroll effects, prefer `IntersectionObserver` and compositor-friendly transforms over per-frame React state. Lenis cannot guarantee a fixed frame rate on every device, so preserve native touch scrolling and honor `prefers-reduced-motion`.

Place project screenshots in `public/images/` as `finance-app.png`, `typetest-app.png`, `food-app.png`, and `translate-app.png`. Until they are present, the cards show a designed fallback. The contact email in the page is a placeholder and should be updated before publishing.