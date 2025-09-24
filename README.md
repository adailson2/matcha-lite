# Matcha Lite

_A full-stack demo dating app built with Node.js, React Native, and AWS (free tier friendly)._

---

## 🚀 Overview

Matcha Lite is a small demo application inspired by dating platforms like Feeld.
It demonstrates how to build and scale a **mobile-first, full-stack solution** using:

- **Backend:** Node.js + TypeScript (AWS Lambda, API Gateway, DynamoDB, Cognito)
- **Frontend:** React Native (Expo) for iOS/Android
- **Infra:** AWS CDK (TypeScript)

The project is intentionally lightweight but shows patterns for **profiles, likes, matches, and chat**, along with authentication and basic trust/safety features.

---

## ✨ Features

- User authentication (AWS Cognito)
- Profile creation & editing (bio, tags, photos)
- Feed browsing (see other profiles)
- Likes & mutual matches
- Match list with chat (polling messages)
- Report/block stub for safety
- Infrastructure as code (CDK)
- CI/CD with GitHub Actions

---

## 🗂️ Project Structure

```
matcha-lite/
  infra/      # AWS CDK for infrastructure
  api/        # Lambda handlers (Node + TypeScript)
  mobile/     # React Native (Expo) app
  shared/     # Shared types/interfaces
```

---

## 🛠️ Tech Stack

- **Frontend:** React Native (Expo), TypeScript
- **Backend:** Node.js, TypeScript, AWS Lambda, API Gateway
- **Database:** DynamoDB (single-table design, on-demand capacity)
- **Auth:** Cognito (User Pools)
- **Storage:** S3 for profile photos (optional in demo)
- **Infra as Code:** AWS CDK (TypeScript)

---

## 🔧 Setup & Deployment

### Prerequisites

- Node.js 18+
- pnpm or npm/yarn
- AWS account (free tier works)
- AWS CLI configured (`aws configure`)
- Expo CLI (`npm install -g expo-cli`)

### 1) Install dependencies (root)

```bash
pnpm install
```

### 2) Bootstrap your AWS environment (once per account+region)

CDK needs a bootstrap stack per account+region. If you plan to use `sa-east-1` (São Paulo):

```bash
cd infra
# optional: ensure region in your shell
export AWS_REGION=sa-east-1
pnpm cdk bootstrap aws://<YOUR_ACCOUNT_ID>/sa-east-1
```

Notes

- Bootstrap is idempotent; you can safely run it again.
- You don't need to undo bootstrap in other regions (e.g., `us-east-1`).

### 3) Deploy infrastructure

```bash
cd infra
pnpm run deploy
```

Important outputs

- `ApiUrl`: API Gateway base URL (e.g., `https://xxxx.execute-api.sa-east-1.amazonaws.com`)
- `TableName`: created DynamoDB table name

Open in Expo Go (iOS/Android) or run in emulator.

---

## 🧪 Testing

### API

Run unit tests with Jest inside the `/api` folder:

```bash
cd api
pnpm test
```

### Mobile

Run component tests with React Native Testing Library inside the `/mobile` folder:

```bash
cd mobile
pnpm test
```

---

## 📦 Roadmap

- [ ] WebSocket chat (API Gateway WebSockets)
- [ ] GraphQL layer with AWS AppSync
- [ ] Moderation & content safety checks
- [ ] AI-driven recommendations
- [ ] Observability with CloudWatch dashboards

---

## 🤝 Contributing

This is a demo/learning project. Feel free to fork, open issues, or submit PRs.

---

## 📜 License

MIT License. Free to use and adapt.

---

## 🧭 Quickstart (summary)

```bash
# 1) install deps
pnpm install

# 2) bootstrap (once per account+region)
cd infra
export AWS_REGION=sa-east-1
pnpm cdk bootstrap aws://<YOUR_ACCOUNT_ID>/sa-east-1

# 3) deploy
pnpm run deploy

# 4) test
export ApiUrl="https://xxxx.execute-api.sa-east-1.amazonaws.com"
curl "$ApiUrl/health"
```

---

## 🧑‍💻 Local development (API)

The sample Lambda is `api/src/health.ts`. Run it locally with the dev script:

```bash
cd api
export TABLE_NAME="<TableName from Outputs or any value>"
# optional custom port: export PORT=4000
pnpm dev:health
```

Test:

```bash
curl http://localhost:${PORT-3000}/health
```

If `table` is `null`, set `TABLE_NAME` before starting.

---

## 📱 Mobile App (Expo)

The app reads the API URL from `EXPO_PUBLIC_API_URL`:

```bash
export EXPO_PUBLIC_API_URL="https://xxxx.execute-api.sa-east-1.amazonaws.com"
cd mobile
pnpm start
# or: pnpm ios | pnpm android | pnpm web
```

When the app opens, it performs `GET /health` and shows the JSON.

---

## 🔐 Asset encryption (S3) and KMS

By default, CDK bootstrap uses SSE-S3 (S3-managed encryption) for the assets bucket. This usually has no monthly cost. Only create a customer-managed KMS key if you have compliance requirements — CMKs have a monthly charge (~$1/month).

---

## 🛟 Troubleshooting

- AccessDenied during bootstrapping (e.g., `cloudformation:CreateChangeSet`):

  - Use a profile/user with temporary `AdministratorAccess` for bootstrap, or equivalent policies.
  - Confirm account/region: `aws sts get-caller-identity` and `AWS_REGION` env var.

- Region mismatch on deploy: `SSM parameter /cdk-bootstrap/hnb659fds/version not found`

  - Bootstrap the same region you are deploying to (e.g., `pnpm cdk bootstrap aws://<YOUR_ACCOUNT_ID>/sa-east-1`).

- `Command "esbuild" not found` when bundling Lambda:

  - Install `esbuild` in the `infra` project (already added). Run `pnpm install` at the root and try `pnpm run deploy` again.

- `curl "$ApiUrl/health"` → `URL rejected: No host part in the URL`:

  - Set the `ApiUrl` env var (or paste the literal URL from Outputs):
    ```bash
    export ApiUrl="https://xxxx.execute-api.sa-east-1.amazonaws.com"
    curl "$ApiUrl/health"
    ```

- Lambda runtime Node 16 warning:
  - Update to Node 18+ in `NodejsFunction` and migrate to AWS SDK v3 as the app evolves.
