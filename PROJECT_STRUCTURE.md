# Project Structure

```text
shaikh-digital-portfolio/
|-- .github/workflows/       # Test, build, and GitHub Pages deployment
|-- deploy/                  # Container web-server configuration
|-- public/                  # Static icons and profile artwork
|-- server/                  # Optional API and Ollama provider
|-- src/
|   |-- assistant/           # Grounded knowledge, routing, fallback, and API client
|   |-- components/          # Portfolio sections and project assistant UI
|   |-- data/                # Shared portfolio facts and service definitions
|   |-- App.jsx
|   |-- index.css
|   `-- main.jsx
|-- tests/                   # Assistant and server behavior tests
|-- .env.example             # Optional server/Ollama configuration
|-- docker-compose.yml
|-- Dockerfile
|-- index.html
|-- package.json
|-- tailwind.config.js
`-- vite.config.js
```

The GitHub Pages build uses the deterministic assistant in the browser. The
optional server layer can enhance grounded responses with Ollama without being
required for the portfolio to function.
