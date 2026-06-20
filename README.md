# Tradox Capital

**Institutional-Grade Wealth Management. Directed by AI.**

Tradox Capital is a premium wealth management and market intelligence platform that combines institutional foresight with advanced machine learning to provide intelligent stock forecasting, automated portfolio optimization, and real-time market insights.

## Features
- **AI Stock Forecasting**: Proprietary neural networks to predict market movements (e.g., NIFTY 50, Bank Nifty) with high precision.
- **Dynamic Portfolio Optimization**: Automatic allocation and restructuring based on the Kautilya Risk Engine.
- **Live Market Intelligence**: Real-time news aggregation from leading financial sources like LiveMint, Economic Times, NDTV Profit, and more.
- **Modern Architecture**: Crystal clear UI featuring seamless Dark/Light mode integration, glassmorphism aesthetics, and responsive mobile-first design.

---

## Project Structure
The project is strictly divided into two core architectures:
- `/frontend` - Contains the Next.js App Router application, UI components, frontend API routes, and styling engine.
- `/backend` - Contains the AI model pipelines, database schemas, and standalone backend tools.

---

## Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS (v4) with CSS Variables for Theme Management
- **Database**: MongoDB (via Prisma ORM)
- **Icons & Graphics**: Lucide React, SVG Charting
- **Data Integrations**: Yahoo Finance API, Custom RSS Parsers for News

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn

### 2. Frontend Setup
Navigate into the frontend directory to run the main application:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Configure Environment Variables:
Create a `.env` file inside the `frontend` directory with your database and API credentials (see `.env.example` if available).

Run the development server:
```bash
npm run dev
```
The application will be running at [http://localhost:3000](http://localhost:3000).

---

## License
All rights reserved. Tradox Capital.
