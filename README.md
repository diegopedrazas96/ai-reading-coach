# Reading Bloom — AI Reading Coach

A full-stack reading practice app for early readers. Pick a story, read it out loud, and get instant word-by-word feedback.

Built with **React 19**, **NestJS 11** and **TypeScript** in an npm-workspaces monorepo.

## Features

- **Two recognition modes**
  - **Browser:** free, live speech recognition with the Web Speech API.
  - **OpenAI (hybrid):** a live on-screen preview while you read, then an accurate final transcript from OpenAI for scoring. If OpenAI is unavailable, the app falls back to the browser transcript and explains why.
- **Word-by-word scoring** using Longest Common Subsequence alignment, so one skipped word doesn't mark the rest of the sentence wrong.
- **Listen mode:** the story is read aloud at a child-friendly pace.
- **Clear error handling:** typed API error codes (missing key, out of credits, rate limited, invalid key) surfaced as friendly messages.
- **Privacy-minded:** no database, and audio is processed in memory and never written to disk.

## Tech stack

| Area     | Tools                                                             |
| -------- | ----------------------------------------------------------------- |
| Frontend | React 19, Vite 6, TypeScript, lucide-react                        |
| Backend  | NestJS 11, OpenAI SDK, `@nestjs/config`, `@nestjs/throttler`      |
| Shared   | `@reading-coach/shared`: API contracts and constants used by both |
| Quality  | Vitest, Supertest, ESLint, Prettier                               |

## Getting started

**Requirements:** Node.js 20+ and npm.

```bash
git clone https://github.com/diegopedrazas96/ai-reading-coach.git
cd ai-reading-coach
npm install
npm run dev
```

Open http://localhost:5173. The web app proxies `/api` to the API on port `3001`.

On Windows you can also run `.\SETUP_WINDOWS.ps1` from the repository root.

### Enabling OpenAI mode (optional)

Browser mode works without any configuration. To enable OpenAI transcription, create a `.env` file in the repository root:

```bash
cp .env.example .env
```

| Variable                     | Required | Default                 | Description                         |
| ---------------------------- | -------- | ----------------------- | ----------------------------------- |
| `OPENAI_API_KEY`             | No       | —                       | Enables OpenAI transcription mode   |
| `OPENAI_TRANSCRIPTION_MODEL` | No       | `gpt-transcribe`        | Transcription model                 |
| `PORT`                       | No       | `3001`                  | API port                            |
| `CORS_ORIGINS`               | No       | `http://localhost:5173` | Comma-separated allowed web origins |

Then restart `npm run dev` and select **OpenAI transcription** in the app. The live preview requires Chrome or Edge.

## Scripts

Run from the repository root:

| Command             | Description                             |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Start shared, API and web in watch mode |
| `npm test`          | Run all unit and end-to-end tests       |
| `npm run typecheck` | Type-check every workspace              |
| `npm run lint`      | Lint the monorepo                       |
| `npm run format`    | Format with Prettier                    |
| `npm run check`     | Typecheck, lint, format check and tests |
| `npm run build`     | Production build of the API and web app |
| `npm run start:api` | Run the built API                       |

## Project structure

```text
apps/
  web/                    React client
    src/
      components/         UI grouped by area (layout, reading, results, ...)
      hooks/              useReadingSession, useSpeechRecognition, useAudioRecorder
      services/           API and speech synthesis
      lib/                Scoring algorithm
      data/ constants/ types/ utils/ styles/
  api/                    NestJS API
    src/
      config/             Typed, validated configuration
      common/             Exceptions and global error filter
      health/             GET /api/health
      transcription/      POST /api/transcribe (controller, service, providers, guard, pipe)
    test/                 End-to-end tests
packages/
  shared/                 Types and constants shared by web and API
```

## Architecture

```text
React app
  ├─ Browser mode ── Web Speech API ──────────────────────────────► transcript
  └─ OpenAI mode ─┬─ Web Speech API ──► live preview
                  └─ MediaRecorder ──► POST /api/transcribe
                                         └─ NestJS ─► OpenAI ───► transcript
                                                                     │
                       evaluateReading(story, transcript) ◄──────────┘
                                         │
                                         ▼
                         highlighted words + accuracy score
```

## API

| Method | Endpoint          | Description                                          |
| ------ | ----------------- | ---------------------------------------------------- |
| `GET`  | `/api/health`     | Service status and whether transcription is enabled  |
| `POST` | `/api/transcribe` | `multipart/form-data` with an `audio` file (≤ 15 MB) |

Errors share one shape:

```json
{ "error": "Human-readable message", "code": "TRANSCRIPTION_QUOTA_EXCEEDED" }
```
