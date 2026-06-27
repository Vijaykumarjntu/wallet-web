# ChadWallet Web - Meme Coin Trading Platform

A modern web trading terminal for ChadWallet, inspired by fomo.family. Built with Next.js, Tailwind, and real Solana data.

## Features

- **Landing Page** with rotating token banners
- **Full Trading Terminal** (`/trade`)
  - Live trending Solana tokens (Dexscreener)
  - Interactive Price Chart
  - Top Holders
  - Live Trades
- **Privy Auth** (Google, Apple, Email, Wallet)
- **Real-time data** from Solana ecosystem

## Tech Stack

- Next.js 16 + TypeScript
- Tailwind CSS
- Privy.io (Auth)
- Dexscreener API (Live token data)
- Lightweight Charts (TradingView style)

## Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/Vijaykumarjntu/wallet-web.git
   cd wallet-web
   npm install 
   npm run dev


Privy Auth Setup (Important)
Get your App ID from Privy Dashboard
put it in .env as NEXT_PUBLIC_PRIVY_APP_ID
Never commit the .env.local file

