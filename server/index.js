const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = 8080;
const DATA_FILE = path.join(__dirname, '../data/todos.json');

// Ensure data directory and file exists with proper permissions
async function initDataFile() {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(DATA_FILE);
    await fs.mkdir(dataDir, { recursive: true });
    
    try {
      await fs.access(DATA_FILE);
      const data = await fs.readFile(DATA_FILE, 'utf8');
      try {
        JSON.parse(data);
        console.log('Existing data file is valid');
      } catch {
        throw new Error('Invalid JSON');
      }
    } catch (error) {
      console.log('Creating new data file...');
      const initialData = {
        lists: [{
          id: 'default',
          name: 'My Tasks',
          color: '#8B5CF6',
          tasks: []
        }]
      };
      await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
      console.log('Created new data file with initial content');
    }
  } catch (error) {
    console.error('Failed to initialize data file:', error);
    throw error;
  }
}

app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.get('/api/data', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const newData = req.body;
    if (!newData || !newData.lists) {
      return res.status(400).json({ error: 'Invalid data format', success: false });
    }

    // Ensure data directory exists
    const dataDir = path.dirname(DATA_FILE);
    await fs.mkdir(dataDir, { recursive: true });

    // Write data to temporary file first
    const tempFile = `${DATA_FILE}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(newData, null, 2));

    // Rename temporary file to actual file (atomic operation)
    await fs.rename(tempFile, DATA_FILE);

    console.log('Data saved successfully');
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data: ' + error.message, success: false });
  }
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

initDataFile().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DoDash server running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to initialize:', error);
  process.exit(1);
});
