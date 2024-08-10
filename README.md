## Introduction

Big Bank is a robust banking app built with Next.js, TypeScript, and Tailwind CSS, featuring secure SSR authentication and database management via Appwrite, multi-bank integration via Plaid, and fund transferring between users via Dwolla. real-time updates across the platform. Users can view their balances, transaction history, and access account information all in real time. The app is fully responsive, with comprehensive form input validation handled by Zod and a modern UI built using ShadCN components.

## Tech Stack
- Next.js
- TypeScript
- TailwindCSS
- Appwrite
- Plaid
- Dwolla
- ShadCN
- React Hook Form
- Chart.js
- Zod

## Todo
- getTransactionStatus only checks for 2 days past transaction date
- transfer money between your own accounts
- transaction details like dwolla's (5:58:40)
- fix top categories

Done:
- amount shows the same for both sender and reciever for transfers
- address validation
    - removed addresses
- fix donut chart
- add customInput to paymentTransferForm
- successful transfer message
- incorrect password/email message

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

