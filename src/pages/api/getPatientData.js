import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'patientData.txt');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to read data' });
    }

    // Split the data into an array of entries
    const entries = data.trim().split('\n').map(line => JSON.parse(line));

    // Check if there are any entries
    if (entries.length === 0) {
      return res.status(404).json({ message: 'No patient data found' });
    }

    // Get the latest entry (assuming the last one is the most recent)
    const latestEntry = entries[entries.length - 1];
    
    // Structure the response to match the desired format
    const patientData = {
      registrationID: latestEntry.regID,
      name: latestEntry.patientName,
      age: latestEntry.age,
      dob: latestEntry.dob,
      regDate: latestEntry.regDate,
      block: latestEntry.block,
      hospital: latestEntry.hospitalName,
    };

    res.status(200).json(patientData);
  });
}
