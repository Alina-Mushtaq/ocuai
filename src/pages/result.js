import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faArrowRight, faCircleXmark } from '@fortawesome/free-solid-svg-icons'; // Import cancel icon
import { collection, getDocs, orderBy, limit, query } from 'firebase/firestore';
import { db } from '../firebase/firebaseconfig';


export default function ReportPage() {
  const [patientDetails, setPatientDetails] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const patientCollection = collection(db, 'patients');
        const patientQuery = query(patientCollection, orderBy('createdAt', 'desc'), limit(1));
        const querySnapshot = await getDocs(patientQuery);

        if (!querySnapshot.empty) {
          const lastPatientData = querySnapshot.docs[0].data();
          setPatientDetails(lastPatientData);
        } else {
          console.error('No patient data found');
        }
      } catch (error) {
        console.error('Failed to fetch patient data from Firestore:', error);
      }
    };

    fetchPatientData();
  }, []);

  if (!patientDetails) {
    return <div>Loading...</div>;
  }

  // Determine condition status
  const isNormal = patientDetails.condition === 'Normal (N)';

  return (
    <div className="flex flex-col items-center p-8 space-y-6">
      <div className="bg-white p-8 shadow-2xl rounded-lg w-full max-w-xl space-y-6">
        <div className="p-6 space-y-2">
          <h2 className="text-xl font-semibold mb-4">Patient Details</h2>
          <p><strong>Registration Application ID:</strong> {patientDetails.regID}</p>
          <p><strong>Name:</strong> {patientDetails.patientName}</p>
          <p><strong>Date of Birth:</strong> {patientDetails.dob}</p>
          <p><strong>Age:</strong> {patientDetails.age}</p>
          <p><strong>Registration Date:</strong> {patientDetails.regDate}</p>
          <p><strong>Block:</strong> {patientDetails.block}</p>
          <p><strong>Hospital Name:</strong> {patientDetails.hospitalName}</p>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-xl font-bold text-[#556B2F]">Report</h2>
          <FontAwesomeIcon 
            icon={isNormal ? faCircleCheck : faCircleXmark} 
            className={isNormal ? 'text-green-600 text-6xl' : 'text-red-600 text-6xl'} 
          />
          <p className="text-lg font-semibold">{isNormal ? 'Normal' : 'Abnormal'}</p>
        </div>

        <div className="bg-gray-100 shadow-md rounded-lg p-4">
          <table className="w-full table-auto">
            <tbody>
              {[
                { label: 'Normal', result: isNormal ? 'Positive' : 'Negative', color: isNormal ? 'text-green-600' : 'text-red-600' },
                { label: 'Diabetes', result: patientDetails.condition === 'Diabetes (D)' ? 'Positive' : 'Negative', color: patientDetails.condition === 'Diabetes (D)' ? 'text-green-600' : 'text-red-600' },
                { label: 'Glaucoma', result: patientDetails.condition === 'Glaucoma (G)' ? 'Positive' : 'Negative', color: patientDetails.condition === 'Glaucoma (G)' ? 'text-green-600' : 'text-red-600' },
                { label: 'Cataract', result: patientDetails.condition === 'Cataract (C)' ? 'Positive' : 'Negative', color: patientDetails.condition === 'Cataract (C)' ? 'text-green-600' : 'text-red-600' },
                { label: 'AMD', result: patientDetails.condition === 'Age related Macular Degeneration (A)' ? 'Positive' : 'Negative', color: patientDetails.condition === 'Age related Macular Degeneration (A)' ? 'text-green-600' : 'text-red-600' },
                { label: 'Hypertension', result: patientDetails.condition === 'Hypertension (H)' ? 'Positive' : 'Negative', color: patientDetails.condition === 'Hypertension (H)' ? 'text-green-600' : 'text-red-600' },
                { label: 'Pathological Myopia', result: patientDetails.condition === 'Pathological Myopia (M)' ? 'Positive' : 'Negative', color: patientDetails.condition === 'Pathological Myopia (M)' ? 'text-green-600' : 'text-red-600' },
                { label: 'Other Abnormalities', result: patientDetails.condition === 'Other diseases/abnormalities (O)' ? 'Positive' : 'Negative', color: patientDetails.condition === 'Other diseases/abnormalities (O)' ? 'text-green-600' : 'text-red-600' },
              ].map((item, index) => (
                <tr key={index} className="border-b border-gray-300 last:border-none shadow-sm hover:shadow-md transition-shadow">
                  <td className="p-4 font-semibold">{item.label}</td>
                  <td className={`p-4 font-semibold ${item.color}`}>{item.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center pt-4">
          <Link href="/report">
            <button className="bg-green-600 text-white font-bold py-2 px-8 rounded-md flex items-center hover:bg-green-700 transition-colors">
              Next <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
