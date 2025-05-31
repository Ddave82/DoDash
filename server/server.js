const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data', 'data.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize data file if it doesn't exist
async function initializeDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify({ lists: [] }));
  }
}

// Read data from file
async function readData() {
  const data = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

// Data validation
function validateData(data) {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.lists)) return false;
  
  return data.lists.every(list => {
    if (!list || typeof list !== 'object') return false;
    if (typeof list.id !== 'number') return false;
    if (typeof list.name !== 'string') return false;
    if (typeof list.color !== 'string' || !list.color.match(/^#[0-9A-Fa-f]{6}$/)) return false;
    if (!Array.isArray(list.todos)) return false;
    
    return list.todos.every(todo => {
      if (!todo || typeof todo !== 'object') return false;
      if (typeof todo.id !== 'number') return false;
      if (typeof todo.text !== 'string') return false;
      if (typeof todo.completed !== 'boolean') return false;
      return true;
    });
  });
}

// Write data to file
async function writeData(data) {
  if (!validateData(data)) {
    throw new Error('Invalid data format');
  }
  
  // Write to temporary file first
  const tempFile = `${DATA_FILE}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(data, null, 2));
  
  // Rename temporary file to actual file (atomic operation)
  await fs.rename(tempFile, DATA_FILE);
}

// Routes
app.get('/api/data', async (req, res) => {
  try {
    const data = await readData();
    if (!validateData(data)) {
      // If data is invalid, initialize with empty data
      const emptyData = { lists: [], keyColor: '#6B46C1' };
      await writeData(emptyData);
      res.json(emptyData);
    } else {
      res.json(data);
    }
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Failed to read data', details: error.message });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    if (!validateData(req.body)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }
    await writeData(req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Error writing data:', error);
    res.status(500).json({ error: 'Failed to write data', details: error.message });
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
