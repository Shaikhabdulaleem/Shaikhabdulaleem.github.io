# Shaikh Abdul Aleem — Digital Portfolio

A responsive React portfolio built with Vite, Tailwind CSS, Framer Motion, and a portfolio-grounded project assistant.

## Live site

The production site is deployed automatically to:

`https://shaikhabdulaleem.github.io`

GitHub Pages runs the deterministic assistant entirely in the browser. It remains grounded in documented portfolio facts and routes qualified visitors to Google Calendar or WhatsApp without requiring a paid AI service.

## Included sections

- Animated interactive brain and project case studies
- Services and capabilities
- Structured delivery process
- Technology toolkit
- Grounded portfolio and project assistant
- Google Calendar and WhatsApp contact options

## Local development

```bash
npm install
npm run dev
```

To test the optional Express/Ollama enhancement locally, run these in separate terminals:

```bash
npm run dev:server
npm run dev
```

## Verification

```bash
npm run verify
```

This runs the complete automated test suite, production build, and dependency security audit.

## Automatic GitHub Pages deployment

Every push to `main` runs the tests, builds with `VITE_STATIC_HOSTING=true`, and deploys `dist/` through GitHub Actions. No API keys or paid hosting services are required.

## Optional Docker/Ollama deployment

The static portfolio does not require Ollama. To run only the deterministic portfolio server:

```bash
docker compose up --build portfolio
```

To enable the local open-source Ollama enhancement, copy `.env.example` to `.env`, set `OLLAMA_ENABLED=true`, choose `OLLAMA_MODEL`, and run:

```bash
docker compose --profile ai up --build
```

The portfolio starts independently while Ollama becomes ready. For a public VPS deployment, place an HTTPS reverse proxy in front of port `3000` and set `PUBLIC_ORIGIN` to the exact public origin.
