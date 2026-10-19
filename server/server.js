const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

// Directories
const publicDir = path.join(__dirname, '..', 'public');
const dataDir = path.join(__dirname, '..', 'data');
const cacheDir = path.join(__dirname, 'cache', 'pdfs');

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// In-memory rate limiter & anti-bot protection for API endpoints
const ipRequestCounts = new Map();
setInterval(() => ipRequestCounts.clear(), 60000); // Reset every minute

function antiScrapeMiddleware(req, res, next) {
  // Allow health check and static assets freely
  if (req.path === '/api/health' || (!req.path.startsWith('/api') && !req.path.startsWith('/pyq-download'))) {
    return next();
  }

  const clientIp = req.ip || req.connection.remoteAddress || '127.0.0.1';
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();

  // Block automated scraper libraries attempting bulk harvesting
  const scraperBots = ['scrapy', 'aiohttp', 'httpx', 'wget', 'mechanize', 'spider', 'crawler'];
  const isScraper = scraperBots.some(bot => userAgent.includes(bot));
  if (isScraper) {
    return res.status(403).json({
      error: 'Direct bulk data scraping is protected. Please access via the official website interface.',
      status: 403
    });
  }

  // Rate limiting: max 100 API requests per minute per IP
  const currentCount = (ipRequestCounts.get(clientIp) || 0) + 1;
  ipRequestCounts.set(clientIp, currentCount);

  if (currentCount > 100) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Automated scraping is throttled to protect server resources.',
      retryAfter: 60
    });
  }

  next();
}

app.use(antiScrapeMiddleware);

// Cache data in memory for sub-millisecond API response times
const dataStore = {
  portals: JSON.parse(fs.readFileSync(path.join(dataDir, 'portals.json'), 'utf-8')),
  year1: JSON.parse(fs.readFileSync(path.join(dataDir, 'year1.json'), 'utf-8')),
  year2: JSON.parse(fs.readFileSync(path.join(dataDir, 'year2.json'), 'utf-8')),
  year3: JSON.parse(fs.readFileSync(path.join(dataDir, 'year3.json'), 'utf-8')),
  year4_other: JSON.parse(fs.readFileSync(path.join(dataDir, 'year4_other.json'), 'utf-8')),
  multiatom_year2: JSON.parse(fs.readFileSync(path.join(dataDir, 'multiatom_year2.json'), 'utf-8')),
  multiatom_year3: JSON.parse(fs.readFileSync(path.join(dataDir, 'multiatom_year3.json'), 'utf-8')),
  multiatom_year4: JSON.parse(fs.readFileSync(path.join(dataDir, 'multiatom_year4.json'), 'utf-8')),
  lectures: JSON.parse(fs.readFileSync(path.join(dataDir, 'lectures.json'), 'utf-8')),
  pyq_bank: JSON.parse(fs.readFileSync(path.join(dataDir, 'pyq_bank.json'), 'utf-8')),
  search_index: JSON.parse(fs.readFileSync(path.join(dataDir, 'search_index.json'), 'utf-8'))
};

console.log(`Loaded ${dataStore.search_index.length} search items into memory.`);
console.log(`Loaded ${dataStore.pyq_bank.papers.length} PYQ papers into memory.`);

// ==========================================
// REST API ENDPOINTS
// ==========================================

// 1. Health check & system stats
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    stats: {
      totalSearchItems: dataStore.search_index.length,
      totalPYQPapers: dataStore.pyq_bank.papers.length,
      portalsCount: dataStore.portals.portals.length
    }
  });
});

// 2. Portals listing
app.get('/api/portals', (req, res) => {
  res.json(dataStore.portals);
});

// 3. Category Notes
app.get('/api/notes/:category', (req, res) => {
  const cat = req.params.category.toLowerCase();
  switch (cat) {
    case '1year':
    case 'year1':
      return res.json(dataStore.year1);
    case '2ndyear':
    case 'year2':
      return res.json(dataStore.year2);
    case '3year':
    case 'year3':
      return res.json(dataStore.year3);
    case '4year':
    case 'year4':
      return res.json(dataStore.year4_other);
    case 'multiatom':
    case 'multiatom-2year':
      return res.json(dataStore.multiatom_year2);
    case '3year-multiatom':
    case 'multiatom-3year':
      return res.json(dataStore.multiatom_year3);
    case '4year-multiatom':
    case 'multiatom-4year':
      return res.json(dataStore.multiatom_year4);
    default:
      return res.status(404).json({ error: `Category '${cat}' not found.` });
  }
});

// 4. Video Lectures API
app.get('/api/lectures', (req, res) => {
  res.json(dataStore.lectures);
});

// 5. PYQ Question Papers API (with filters & search)
app.get('/api/pyq', (req, res) => {
  const { sem, semester, search, session, code, limit, page } = req.query;
  let papers = dataStore.pyq_bank.papers;

  // Filter by semester
  const s = sem || semester;
  if (s) {
    const semNum = parseInt(s, 10);
    papers = papers.filter(p => p.semester === semNum);
  }

  // Filter by session
  if (session) {
    papers = papers.filter(p => p.session === session);
  }

  // Filter by code
  if (code) {
    const cleanCode = code.toLowerCase().trim();
    papers = papers.filter(p => p.code.toLowerCase().includes(cleanCode));
  }

  // Keyword search
  if (search) {
    const q = search.toLowerCase().trim();
    papers = papers.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.session.toLowerCase().includes(q)
    );
  }

  // Pagination support
  const total = papers.length;
  if (limit) {
    const lim = Math.max(1, parseInt(limit, 10));
    const p = Math.max(1, parseInt(page || '1', 10));
    const startIndex = (p - 1) * lim;
    papers = papers.slice(startIndex, startIndex + lim);
    return res.json({
      total,
      page: p,
      limit: lim,
      totalPages: Math.ceil(total / lim),
      papers
    });
  }

  res.json({
    total,
    papers
  });
});

// 6. Global Instant Search API
app.get('/api/search', (req, res) => {
  const q = (req.query.q || req.query.query || '').trim().toLowerCase();
  const category = (req.query.category || '').trim().toLowerCase();
  const limit = parseInt(req.query.limit || '50', 10);

  if (!q && !category) {
    return res.json({ query: '', count: 0, results: [] });
  }

  let matches = dataStore.search_index;

  if (category) {
    matches = matches.filter(item => item.category.toLowerCase().includes(category));
  }

  if (q) {
    const words = q.split(/\s+/).filter(Boolean);
    matches = matches.filter(item => {
      const searchBlob = `${item.title} ${item.category} ${item.subCategory}`.toLowerCase();
      return words.every(word => searchBlob.includes(word));
    });
  }

  res.json({
    query: q,
    count: matches.length,
    results: matches.slice(0, limit)
  });
});

// ==========================================
// PYQ PDF PROXY & STREAMING WITH LOCAL DISK CACHE
// ==========================================

async function handlePdfDownload(req, res) {
  const id = req.params.id || req.query.id;
  const nonce = req.params.nonce || req.query.nonce || '';
  const code = (req.query.code || 'PAPER').replace(/[^a-zA-Z0-9_-]/g, '');
  const title = (req.query.title || 'AKTU_Paper').replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_');
  const isDownload = req.query.dl === '1';

  if (!id) {
    return res.status(400).json({ error: 'Paper ID is required' });
  }

  const safeFilename = `${code}-${title}.pdf`;
  const cacheFile = path.join(cacheDir, `${id}_${nonce || 'standard'}.pdf`);

  // Headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition, Content-Type, Content-Length');
  res.setHeader('Content-Disposition', `${isDownload ? 'attachment' : 'inline'}; filename="${safeFilename}"`);

  // 1. Serve from cache if already downloaded
  if (fs.existsSync(cacheFile) && fs.statSync(cacheFile).size > 1000) {
    return fs.createReadStream(cacheFile).pipe(res);
  }

  // 2. Fetch from upstream Netlify durable function
  const upstreamUrl = `https://getwayclassesnotes.netlify.app/.netlify/functions/download?id=${encodeURIComponent(id)}&nonce=${encodeURIComponent(nonce)}&code=${encodeURIComponent(code)}&title=${encodeURIComponent(title)}`;

  https.get(upstreamUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  }, (upstreamRes) => {
    if (upstreamRes.statusCode === 200) {
      // Pipe to cache file and response simultaneously
      const fileStream = fs.createWriteStream(cacheFile);
      upstreamRes.pipe(fileStream);
      upstreamRes.pipe(res);
    } else {
      res.status(upstreamRes.statusCode).json({
        error: 'Failed to retrieve paper PDF from upstream server',
        statusCode: upstreamRes.statusCode
      });
    }
  }).on('error', (err) => {
    console.error('PDF proxy error:', err);
    res.status(502).json({ error: 'PDF streaming error: ' + err.message });
  });
}

// Register PDF download endpoints matching both local & netlify patterns
app.get('/pyq-download/:id/:nonce?', handlePdfDownload);
app.get('/.netlify/functions/download', handlePdfDownload);
app.get('/api/pyq/download', handlePdfDownload);

// ==========================================
// FRONTEND ROUTE HANDLERS
// ==========================================

const pageRoutes = {
  '/': 'index.html',
  '/1year': '1year.html',
  '/2ndyear': '2ndyear.html',
  '/3year': '3year.html',
  '/4year': '4year.html',
  '/multiatom': 'multiatom.html',
  '/3year-multiatom': '3year-multiatom.html',
  '/4year-multiatom': '4year-multiatom.html',
  '/lectindex': 'lectindex.html',
  '/under': 'under.html',
  '/viewer': 'viewer.html'
};

for (const [routePath, fileName] of Object.entries(pageRoutes)) {
  app.get(routePath, (req, res) => {
    res.sendFile(path.join(publicDir, fileName));
  });
}

// Serve all static assets from public
app.use(express.static(publicDir));

// Fallback for any other page route
app.get('*', (req, res) => {
  const reqFile = path.join(publicDir, req.path.replace(/^\//, ''));
  if (fs.existsSync(reqFile) && fs.statSync(reqFile).isFile()) {
    return res.sendFile(reqFile);
  }
  // Try with .html extension
  if (fs.existsSync(reqFile + '.html')) {
    return res.sendFile(reqFile + '.html');
  }
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 AKTU Notes Store Server running on:`);
  console.log(`   - Local:    http://localhost:${PORT}`);
  console.log(`   - Network:  http://127.0.0.1:${PORT}`);
  console.log(`   - API Docs: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
