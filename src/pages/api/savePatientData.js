import fs from 'fs';
import path from 'path';

// Define the path to the JSON file
const filePath = path.join(process.cwd(), 'data', 'patients.json');

export default function handler(req, res) {
  if (req.method === 'POST') {
    const newData = req.body;

    // Read existing data from the JSON file
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err && err.code !== 'ENOENT') {
        return res.status(500).json({ message: 'Failed to read data' });
      }

      // Parse existing data or create an empty array if the file doesn't exist
      const existingData = data ? JSON.parse(data) : [];

      // Append new data
      existingData.push(newData);

      // Write updated data back to the JSON file
      fs.writeFile(filePath, JSON.stringify(existingData, null, 2), (writeErr) => {
        if (writeErr) {
          return res.status(500).json({ message: 'Failed to save data' });
        }
        res.status(200).json({ message: 'Data saved successfully' });
      });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
