# Deploying UnifyAPI

UnifyAPI ships with config for two targets: **Vercel** (managed) and **Docker** (self-host).
Pick one. Both need a PostgreSQL database and the same environment variables.

---

## Credentials checklist

Gather these before deploying (all optional ones degrade gracefully):

| Variable | Required? | Where to get it |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | A managed Postgres: [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Prisma Postgres](https://www.prisma.io/postgres). Copy the connection string. |
| `API_KEY_SECRET` | ✅ | Any long random string (`openssl rand -hex 32`). |
| `NEXT_PUBLIC_APP_URL` | ✅ | Your public URL, e.g. `https://unifyapi.yourdomain.com`. |
| `NEXT_PUBLIC_PRIVY_APP_ID` | for Privy | [dashboard.privy.io](https://dashboard.privy.io) → your app → App ID. |
| `PRIVY_APP_SECRET` | for Privy | Same Privy app → App Secret. |
| `X402_PAY_TO` | for real payments | The wallet address (0x…) that receives USDC. |
| `X402_NETWORK` | for real payments | `base-sepolia` (testnet) or `base` (mainnet). |
| `X402_FACILITATOR_URL` | for real payments | `https://x402.org/facilitator` (testnet) or a Coinbase CDP facilitator (mainnet). |

> Leave Privy and x402 vars empty to run with the demo login and simulated payments.

---

## Option A — Vercel

1. Push this repo to GitHub.
2. In Vercel, **New Project → import the repo**. Vercel reads `vercel.json` (framework, build, and
   `--legacy-peer-deps` install — required by Privy).
3. Add all environment variables from the checklist in **Project → Settings → Environment Variables**.
4. Provision Postgres (Neon/Supabase/Prisma Postgres) and set `DATABASE_URL`.
5. Deploy. After the first deploy, create the schema and seed it once — from your machine, pointing
   at the production DB:

   ```bash
   DATABASE_URL="<prod-url>" npx prisma db push
   DATABASE_URL="<prod-url>" npm run db:seed
   ```

6. In the Privy dashboard, add your Vercel domain to **Allowed origins**.

---

## Option B — Docker

A `Dockerfile` (Next.js standalone) and `docker-compose.yml` (app + Postgres) are included.

### Quick start with compose

```bash
# Optional overrides — otherwise sensible defaults are used:
export NEXT_PUBLIC_APP_URL=http://localhost:3000
export API_KEY_SECRET=$(openssl rand -hex 32)
# export NEXT_PUBLIC_PRIVY_APP_ID=...   PRIVY_APP_SECRET=...
# export X402_PAY_TO=0x...

docker compose up --build -d

# Create schema + seed (one time):
docker compose exec app npx prisma db push
docker compose exec app npm run db:seed
```

App is live at <http://localhost:3000>; Postgres is on `localhost:5432`.

### Standalone image (external Postgres)

```bash
docker build \
  --build-arg NEXT_PUBLIC_APP_URL=https://your-domain.com \
  --build-arg NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id \
  -t unifyapi .

docker run -p 3000:3000 \
  -e DATABASE_URL="postgres://..." \
  -e API_KEY_SECRET="..." \
  -e NEXT_PUBLIC_APP_URL="https://your-domain.com" \
  -e PRIVY_APP_SECRET="..." \
  unifyapi
```

> `NEXT_PUBLIC_*` values are baked into the client bundle at **build** time, so they are build args.
> Server-only secrets (`DATABASE_URL`, `PRIVY_APP_SECRET`, `X402_*`) are passed at **run** time.

---

## Going live with real x402 payments

1. Set `X402_PAY_TO` to your receiving wallet and choose `X402_NETWORK`.
2. Testnet: keep `X402_FACILITATOR_URL=https://x402.org/facilitator` and fund a wallet with
   Base-Sepolia USDC to test.
3. Mainnet: use a Coinbase CDP facilitator and set `CDP_API_KEY_ID` / `CDP_API_KEY_SECRET`.

With `X402_PAY_TO` set, `POST /api/payments/topup` returns HTTP 402 with payment requirements; an
x402-capable client (e.g. a Privy embedded wallet) completes payment and the server settles it
through the facilitator before crediting the balance.
