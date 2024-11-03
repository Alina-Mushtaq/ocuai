import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCAcesLW-nu96NUqBfWBRMeigurbeEgj68",
  authDomain: "ocuai-7d1ca.firebaseapp.com",
  projectId: "ocuai-7d1ca",
  storageBucket: "ocuai-7d1ca.firebasestorage.app",
  messagingSenderId: "809042679791",
  appId: "1:809042679791:web:cf5c63693832ad8215481a",
  measurementId: "G-19NFZJ3D7J"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const patientData = req.body;

      // Save patient data to Firestore
      const docRef = await addDoc(collection(db, 'patients'), patientData);
      console.log('Document written with ID: ', docRef.id);
      res.status(200).json({ id: docRef.id, message: 'Data saved successfully' });
    } catch (error) {
      console.error('Error saving patient data:', error);
      res.status(500).json({ message: 'Failed to save data', error: error.message });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
