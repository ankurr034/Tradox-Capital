const https = require('https');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Readable } = require('stream');

const INDICES = [
  { id: 'NIFTY_50', url: 'ind_nifty50list.csv', name: 'NIFTY 50', desc: 'Top 50 companies' },
  { id: 'NIFTY_NEXT_50', url: 'ind_niftynext50list.csv', name: 'NIFTY NEXT 50', desc: 'Next 50 large cap companies' },
  { id: 'NIFTY_500', url: 'ind_nifty500list.csv', name: 'NIFTY 500', desc: 'Top 500 companies' },
  { id: 'NIFTY_BANK', url: 'ind_niftybanklist.csv', name: 'NIFTY BANK', desc: 'Top banking companies' },
  { id: 'NIFTY_IT', url: 'ind_niftyitlist.csv', name: 'NIFTY IT', desc: 'Top IT companies' },
  { id: 'NIFTY_FMCG', url: 'ind_niftyfmcglist.csv', name: 'NIFTY FMCG', desc: 'Top FMCG companies' },
  { id: 'NIFTY_PHARMA', url: 'ind_niftypharmalist.csv', name: 'NIFTY PHARMA', desc: 'Top pharmaceutical companies' },
  { id: 'NIFTY_MIDCAP_150', url: 'ind_niftymidcap150list.csv', name: 'NIFTY MIDCAP 150', desc: 'Top 150 midcap companies' },
  { id: 'NIFTY_AUTO', url: 'ind_niftyautolist.csv', name: 'NIFTY AUTO', desc: 'Top auto companies' },
  { id: 'NIFTY_FIN_SRV', url: 'ind_niftyfinlist.csv', name: 'NIFTY FINANCIAL SERVICES', desc: 'Top financial service companies' },
  { id: 'NIFTY_REALTY', url: 'ind_niftyrealtylist.csv', name: 'NIFTY REALTY', desc: 'Top real estate companies' },
  { id: 'NIFTY_METAL', url: 'ind_niftymetallist.csv', name: 'NIFTY METAL', desc: 'Top metal & mining companies' },
  { id: 'NIFTY_ENERGY', url: 'ind_niftyenergylist.csv', name: 'NIFTY ENERGY', desc: 'Top energy companies' },
  { id: 'NIFTY_PSU_BANK', url: 'ind_niftypsubanklist.csv', name: 'NIFTY PSU BANK', desc: 'Public sector banks' }
];

const downloadCSV = (filename) => {
  return new Promise((resolve, reject) => {
    https.get(`https://archives.nseindia.com/content/indices/${filename}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, (res) => {
      if (res.statusCode !== 200) {
        if (filename === 'ind_niftyfinlist.csv') {
          // Retry with alternative name
          return resolve(downloadCSV('ind_niftyfinancelist.csv'));
        }
        reject(new Error(`Failed to download ${filename}: ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
};

const parseCSV = (csvData) => {
  return new Promise((resolve, reject) => {
    const results = [];
    Readable.from(csvData)
      .pipe(csv())
      .on('data', (data) => {
        if (data.Symbol) {
          results.push({
            company: data['Company Name'] || data['Company'],
            sector: data['Industry'] || data['Sector'] || 'Unknown',
            symbol: data['Symbol'],
            exchange: 'NSE'
          });
        }
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
};

async function main() {
  const resultData = {
    metadata: [],
    constituents: {}
  };

  const outputDir = path.join(__dirname, '../src/data');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  for (const index of INDICES) {
    console.log(`Downloading ${index.name}...`);
    try {
      const csvStr = await downloadCSV(index.url);
      const parsed = await parseCSV(csvStr);
      
      resultData.metadata.push({
        id: index.id,
        name: index.name,
        desc: index.desc,
        constituents: `${parsed.length} Stocks`
      });
      
      resultData.constituents[index.id] = parsed;
      console.log(`Success: Parsed ${parsed.length} constituents for ${index.name}`);
    } catch (err) {
      console.error(`Error processing ${index.name}:`, err.message);
      // Create a fallback
      resultData.metadata.push({
        id: index.id,
        name: index.name,
        desc: index.desc,
        constituents: 'Data Unavailable'
      });
      resultData.constituents[index.id] = [];
    }
  }

  fs.writeFileSync(
    path.join(outputDir, 'all_indices.json'), 
    JSON.stringify(resultData, null, 2)
  );
  console.log('Finished writing src/data/all_indices.json');
}

main();
