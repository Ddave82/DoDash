const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize data file if it doesn't exist
async function initializeDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify({ lists: [], keyColor: '#6B46C1' }));
  }
}

// Read data from file
async function readData() {
  const data = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

// Write data to file
async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Routes
app.get('/api/data', async (req, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    await writeData(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to write data' });
  }
});

// Initialize and start server
async function start() {
  await initializeDataFile();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
