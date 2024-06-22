const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Define the path to your JSON file
const jsonFilePath = path.resolve(__dirname, '../jsondata.json');

// GET route to fetch JSON file content
router.get('/getjson', (req, res) => {
  try {
    // Read the JSON file
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    const data = JSON.parse(jsonData);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching JSON file' });
  }
});

module.exports = router;
