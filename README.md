# UnifyAPI

> One API key and one billing rail for hundreds of API tools across many providers — exposed to AI agents through a single **MCP** endpoint and billed per call with **x402** crypto payments.

UnifyAPI is a full-stack demo platform (inspired by the MCP + x402 ecosystem) built with **Next.js 16**, **PostgreSQL + Prisma 7**, and **x402**. Agents connect once and call any tool; humans manage keys, balance, and usage from a dashboard.

---

## Features

- **Tool catalog** — 24 seeded tools across 12 categories and 13 providers.
- **Three access surfaces**
  - REST: `POST /api/call/{slug}`
  - MCP (JSON-RPC): `POST /api/mcp` — `initialize`, `tools/list`, `tools/call`
  - OpenAPI 3.1 spec: `GET /api/openapi`
  - Machine-readable agent card: `GET /api/agent-card`
- **Privy authentication** — email / Google / wallet login with embedded wallets; falls back to a demo email login when Privy isn't configured.
- **API-key auth** — hashed keys, Bearer tokens, revocation.
- **Per-call billing** — every call validates input, checks balance, executes, charges, and records usage atomically.
- **x402 crypto payments** — top up balance with USDC; real verify/settle through a facilitator, with an automatic **simulation mode** when not configured.
- **Live + mock tools** — weather (Open-Meteo) and crypto price (CoinGecko) hit real key-less APIs; the rest return realistic mock data.
- **Dashboard** — balance, top-up, key management, usage history.
- **Tool playground** — run real calls from the tool detail page.

## Tech stack

| Layer    | Choice |
| -------- | ------ |
| Framework| Next.js 16 (App Router, Turbopack) + React 19 + TypeScript |
| Styling  | Tailwind CSS v4 |
| Database | PostgreSQL via Prisma 7 (`prisma-client` generator + `@prisma/adapter-pg`) |
| Payments | x402 (USDC on Base / Base-Sepolia) |

---

## Getting started

### 1. Install

```bash
npm install
```

### 2. Start a database

For local development, run a zero-install Postgres with Prisma:

```bash
npm run db:dev      # starts a local Prisma Postgres server (keep this running)
```

This prints connection URLs. The default `.env` is already pointed at the local server
(`postgres://postgres:postgres@localhost:51214/template1`).

> **Production:** set `DATABASE_URL` in `.env` to your own PostgreSQL connection string instead.

### 3. Create the schema & seed data

In a second terminal:

```bash
npm run db:push     # create tables
npm run db:seed     # load categories, providers, and tools
```

### 4. Run the app

```bash
npm run dev
```

Open <http://localhost:3000>.

---

## Using the API

Create an account and key:

1. Go to `/login`, enter any email (passwordless demo auth).
2. On `/dashboard`, click **Top up** (credits instantly in simulation mode) and **Create new key**.

Call a tool over REST:

```bash
curl -X POST http://localhost:3000/api/call/crypto.price \
  -H "Authorization: Bearer uak_live_..." \
  -H "Content-Type: application/json" \
  -d '{ "coin": "bitcoin", "vs": "usd" }'
```

Call a tool over MCP:

```bash
curl -X POST http://localhost:3000/api/mcp \
  -H "Authorization: Bearer uak_live_..." \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call",
       "params":{"name":"weather__current","arguments":{"latitude":-6.2,"longitude":106.8}}}'
```

> MCP tool names replace dots with double underscores: `weather.current` → `weather__current`.

---

## Enabling real x402 payments

By default the server runs in **simulation mode**: top-ups credit instantly and no on-chain
settlement happens. To enable **real** crypto payments, fill these in `.env`:

```env
X402_PAY_TO="0xYourReceivingWalletAddress"
X402_NETWORK="base-sepolia"                  # or "base" for mainnet
X402_FACILITATOR_URL="https://x402.org/facilitator"
# Mainnet via Coinbase CDP facilitator also needs:
# CDP_API_KEY_ID="..."
# CDP_API_KEY_SECRET="..."
```

With `X402_PAY_TO` set, `POST /api/payments/topup` returns **HTTP 402** with payment
requirements. An x402-capable client/wallet completes the payment and retries with an
`X-PAYMENT` header, which the server verifies and settles through the facilitator before
crediting the balance.

> The wallet, network, and facilitator credentials must be supplied by you — they are the only
> pieces that can't be bundled into the demo.

---

## Project structure

```
prisma/
  schema.prisma         # data model
  seed.ts               # catalog seed
src/
  app/
    page.tsx            # landing
    tools/              # catalog + tool detail (+ playground)
    docs/               # documentation
    login/  dashboard/  # account UI
    api/
      tools/            # public catalog
      call/[slug]/      # authenticated tool execution + billing
      mcp/              # MCP JSON-RPC endpoint
      openapi/          # OpenAPI 3.1 spec
      agent-card/       # agent discovery card
      keys/  me/  auth/ # account management
      payments/topup/   # x402 top-up
  lib/
    prisma.ts  apiKeys.ts  auth.ts
    catalog.ts validate.ts execute.ts  billing.ts  x402.ts
  components/           # client UI (CodeTabs, Playground, CatalogSearch)
```

---

## Authentication (Privy)

Set `NEXT_PUBLIC_PRIVY_APP_ID` and `PRIVY_APP_SECRET` (from [dashboard.privy.io](https://dashboard.privy.io))
to enable real auth: email, Google, and crypto-wallet login, each with an embedded wallet. The
client signs in with Privy, and the server verifies the Privy access token and bridges it into a
session (`src/app/api/auth/privy/route.ts`). With those vars empty, the app uses a passwordless demo
login so you can run it immediately.

## Deployment

See **[DEPLOY.md](./DEPLOY.md)** for step-by-step Vercel and Docker instructions, plus the full
environment-variable checklist. In short:

- **Vercel**: import the repo (uses `vercel.json`), set env vars, point `DATABASE_URL` at managed Postgres.
- **Docker**: `docker compose up --build` brings up the app + Postgres together.

## Live vs mock tools

11 tools call real, key-less upstreams (weather, crypto price/market, FX, geocode, timezone,
dictionary, translation, news). The rest return realistic mock data — wire them to real providers in
`src/lib/execute.ts`.

## Notes & caveats (it's a demo)

- Rate limiting, caching, and retries are described in the UI but not fully implemented.
- The x402 mainnet path needs a Coinbase CDP facilitator; testnet works with the public facilitator.
