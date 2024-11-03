import { getFirestore, collection, getDocs } from 'firebase/firestore';
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const patientsCol = collection(db, 'patients');
    const patientSnapshot = await getDocs(patientsCol);
    const patientList = patientSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(patientList);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
