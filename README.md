# Shaikh — Digital Portfolio

A responsive React portfolio website built with Vite, Tailwind CSS, and Framer Motion.

## Included sections

- Sticky navigation and availability banner
- Animated hero and command-center metrics
- Services and capabilities
- Structured delivery process
- Interactive neural case-study map
- Technology toolkit
- Google Calendar and WhatsApp contact options

## Run locally

```bash
npm install
npm run dev
```

Open the local address printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

The compiled website is created in `dist/`.

## Portfolio assistant

The chat widget has a deterministic, portfolio-grounded sales assistant that remains available without AI. An optional Ollama model can improve phrasing, while the server controls retrieval and rejects unsupported sensitive claims.

After qualifying a project, the assistant offers direct Google Calendar booking and WhatsApp contact at `+966511493209`. It does not collect, store, or email lead details.

For local development, copy `.env.example` to `.env` if you want to configure Ollama, then run the UI and API in separate terminals:

```bash
npm run dev:server
npm run dev
```

The UI works in deterministic fallback mode if the API or Ollama is unavailable.

## Docker deployment

Configure `.env`, then start the portfolio and Ollama:

```bash
docker compose up --build
```

The site is served on port `3000`. Put a TLS reverse proxy in front of it and set `PUBLIC_ORIGIN` to the exact public HTTPS origin. Change `OLLAMA_MODEL` to replace the model without changing application code. Set `OLLAMA_ENABLED=false` for deterministic-only operation.

## Verification

```bash
npm test
npm run build
```
