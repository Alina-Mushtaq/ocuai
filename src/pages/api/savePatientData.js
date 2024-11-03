import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    console.log('Received data:', data); // Log the received data

    // Define the path to the data directory and the text file
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'patientData.txt');

    // Check if the data directory exists, if not, create it
    fs.access(dataDir, fs.constants.F_OK, (dirErr) => {
      if (dirErr) {
        fs.mkdir(dataDir, { recursive: true }, (mkdirErr) => {
          if (mkdirErr) {
            console.error('Failed to create data directory:', mkdirErr); // Log error
            return res.status(500).json({ message: 'Failed to create data directory' });
          }
          saveData(filePath, data, res);
        });
      } else {
        saveData(filePath, data, res);
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Helper function to save data
const saveData = (filePath, data, res) => {
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If the file does not exist, create it
      fs.writeFile(filePath, '', (writeErr) => {
        if (writeErr) {
          console.error('Failed to create file:', writeErr); // Log error
          return res.status(500).json({ message: 'Failed to create file' });
        }
        appendDataToFile(filePath, data, res);
      });
    } else {
      appendDataToFile(filePath, data, res);
    }
  });
};

// Helper function to append data to the file
const appendDataToFile = (filePath, data, res) => {
  fs.appendFile(filePath, JSON.stringify(data) + '\n', (err) => {
    if (err) {
      console.error('Failed to save data:', err); // Log error
      return res.status(500).json({ message: 'Failed to save data' });
    }
    res.status(200).json({ message: 'Data saved successfully' });
  });
};
