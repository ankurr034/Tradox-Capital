const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding News & Research data...");

  // Seed AI Analysis for RELIANCE
  await prisma.aIAnalysis.upsert({
    where: { symbol: 'RELIANCE' },
    update: {},
    create: {
      symbol: 'RELIANCE',
      bullishFactors: 'Strong retail growth, Jio 5G expansion, New energy initiatives.',
      bearishFactors: 'High debt levels in short term, regulatory risks in telecom.',
      analystConsensus: 'STRONG BUY',
      riskScore: 35,
      growthScore: 85,
      valuationScore: 60,
      investmentThesis: 'Reliance Industries represents a diversified conglomerate transitioning from an oil-heavy portfolio to a digital and retail powerhouse. The strategic investments in Jio Financial Services and green energy provide a massive runway for the next decade. While valuation is slightly premium, the consistent execution warrants a core portfolio position.'
    }
  });

  // Seed Stock Fundamentals for RELIANCE
  await prisma.stockFundamentals.upsert({
    where: { symbol: 'RELIANCE' },
    update: {},
    create: {
      symbol: 'RELIANCE',
      companyOverview: 'Reliance Industries Limited is an Indian multinational conglomerate headquartered in Mumbai. It has diverse businesses including energy, petrochemicals, natural gas, retail, telecommunications, mass media, and textiles.',
      businessModel: 'B2B (Oil to Chemicals), B2C (Retail & Telecom), B2B2C (Digital Services)',
      industryAnalysis: 'The Indian retail and telecom sectors are experiencing rapid digitization and consolidation, highly favorable for market leaders.',
      swotStrengths: 'Market leadership in Telecom and Retail, Massive cash flows from O2C.',
      swotWeaknesses: 'High capital expenditure requirements, cyclicality of oil business.',
      swotOpportunities: 'Green Energy ecosystem, Jio Financial Services disruption.',
      swotThreats: 'Intense competition in retail (Amazon, Tata), changing global energy demands.',
      peRatio: 28.5,
      pbRatio: 2.1,
      roe: 9.8,
      roce: 10.5,
      debtToEquity: 0.4,
      revenueGrowth: 22.4,
      profitGrowth: 15.2,
    }
  });

  // Seed Articles
  const articles = [
    {
      title: "Reliance Jio Announces Nationwide 6G Testing Lab",
      summary: "In a massive leap for Indian telecommunications, Jio has launched a state-of-the-art 6G testing lab.",
      content: "<p>Reliance Jio has taken the lead in next-generation telecom infrastructure by opening a massive testing facility in Navi Mumbai dedicated to 6G research...</p><p>This move is expected to put India on the global map for telecom innovation and potentially reduce reliance on foreign network hardware.</p>",
      source: "Economic Times",
      author: "Rajesh Sharma",
      category: "NEWS",
      impact: "POSITIVE",
      relatedSymbol: "RELIANCE",
      relatedIndex: "NIFTY 50",
      readTime: 4
    },
    {
      title: "RBI Keeps Repo Rate Unchanged at 6.5%",
      summary: "The Monetary Policy Committee voted unanimously to keep the repo rate unchanged, signaling inflation is under control.",
      content: "<p>The Reserve Bank of India (RBI) Governor announced today that the MPC has decided to hold the benchmark repo rate at 6.5%...</p><p>Markets reacted positively to the news, with Bank Nifty rallying over 400 points in early trade.</p>",
      source: "Mint",
      category: "NEWS",
      impact: "POSITIVE",
      relatedIndex: "NIFTY BANK",
      readTime: 3
    },
    {
      title: "Why IT Stocks Are Facing Margin Pressures",
      summary: "TCS and Infosys report tightening margins as US clients delay discretionary spending.",
      content: "<p>The Indian IT sector is facing strong headwinds as macroeconomic uncertainty in the US and Europe causes clients to delay large transformation projects.</p><p>Analysts suggest that while the long-term outlook remains robust, the next two quarters might see muted growth.</p>",
      source: "Moneycontrol",
      category: "RESEARCH",
      impact: "NEGATIVE",
      relatedIndex: "NIFTY IT",
      readTime: 7
    }
  ];

  for (const article of articles) {
    await prisma.article.create({
      data: article
    });
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
