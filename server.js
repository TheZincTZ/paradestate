const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/branches', (req, res) => {
  // Sample branches data
  const branches = [
    { id: 1, name: 'SSP BRANCH' },
    { id: 2, name: 'S1 BRANCH' },
    { id: 3, name: 'S2 BRANCH' },
    { id: 4, name: 'S3 BRANCH' },
    { id: 5, name: 'S4 BRANCH' },
    { id: 6, name: 'OCHQ' }
  ];
  res.json(branches);
});

app.get('/api/personnel', (req, res) => {
  // Sample personnel data
  const personnel = [
    { id: 1, name: '3SG SIVA', branch: 'SSP BRANCH' },
    { id: 2, name: 'CPL DARREN', branch: 'SSP BRANCH' },
    { id: 3, name: 'REC NICHOLAS', branch: 'SSP BRANCH' },
    // Add more personnel as needed
  ];
  res.json(personnel);
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express API
module.exports = app; 