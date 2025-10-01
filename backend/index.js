// backend/index.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const upload = multer({ dest: UPLOAD_DIR });

// === Simple in-memory "staging DB" (dev). Replace with Firebase/SQL later.
let stagedScans = [];

// Endpoint frontend calls to record a scan
app.post('/api/scan', (req, res) => {
  const { serial, stage, operator, timestamp } = req.body;
  if (!serial) return res.status(400).json({ error: 'serial required' });
  const record = {
    serial,
    stage: stage || 'received',
    operator: operator || 'unknown',
    timestamp: timestamp || new Date().toISOString(),
  };
  stagedScans.push(record);
  res.json({ ok: true, record });
});

// Get staged scans
app.get('/api/staged', (req, res) => {
  res.json(stagedScans);
});

// Clear staged (dev)
app.post('/api/staged/clear', (req, res) => {
  stagedScans = [];
  res.json({ ok: true });
});

// Upload template .xlsm (optional)
app.post('/api/upload-template', upload.single('template'), (req, res) => {
  res.json({ ok: true, path: req.file.path });
});

// Append staged scans into the Master Excel (.xlsm)
app.post('/api/export-to-excel', async (req, res) => {
  try {
    const templatePath = path.join(UPLOAD_DIR, 'template.xlsm');
    if (!fs.existsSync(templatePath)) {
      return res.status(400).json({ error: 'template.xlsm not found in uploads/' });
    }

    // Read workbook
    const wb = XLSX.readFile(templatePath, { cellDates: true, bookVBA: true });

    const sheetName = wb.SheetNames[0]; // adjust if needed
    const ws = wb.Sheets[sheetName];

    const existing = XLSX.utils.sheet_to_json(ws, { defval: '' });

    // Append stagedScans
    const appended = existing.concat(
      stagedScans.map((s) => ({
        'Serial No': s.serial,
        Stage: s.stage,
        Operator: s.operator,
        Timestamp: s.timestamp,
      }))
    );

    const newWs = XLSX.utils.json_to_sheet(appended, { skipHeader: false });
    wb.Sheets[sheetName] = newWs;

    const outName = `Master_${Date.now()}.xlsm`;
    const outPath = path.join(UPLOAD_DIR, outName);

    XLSX.writeFile(wb, outPath, { bookType: 'xlsm', bookVBA: true });

    res.download(outPath, outName, (err) => {
      if (err) console.error('download error', err);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Export failed', details: err.message });
  }
});

const PORT = 4000;
app.listen(4000, '0.0.0.0', () => console.log('Backend on http://0.0.0.0:4000'));

