import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { db } from './firebase/firebaseconfig'; // Adjust the path as necessary
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export default function PDFPage() {
  const [patientDetails, setPatientDetails] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);

  const hospitalLogo = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpngtree.com%2Fso%2Fhospital-logo&psig=AOvVaw3BAth2Oodr-_FWa9zBz7qm&ust=1730717268686000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCIDiwrL-v4kDFQAAAAAdAAAAABAJ'; // Hospital logo URL
  const companyLogo = 'https://media.licdn.com/dms/image/v2/D560BAQE7Z47nmJKaZw/company-logo_200_200/company-logo_200_200/0/1699535481008?e=2147483647&v=beta&t=9GOT-8N2oX_kfrbxFW728AiXtN4qhNhkCgAyZTEwoEE'; // Company logo URL
  const greenTick = 'https://as1.ftcdn.net/v2/jpg/05/57/72/02/1000_F_557720237_tKXQE4MGcQdFDMcsP3nTyYQ3Ia0T1qE9.jpg'; // Green tick image URL

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const patientCollection = collection(db, 'patients'); // Reference to the 'patients' collection
        const patientQuery = query(patientCollection, orderBy('createdAt', 'desc'), limit(1)); // Query to get the most recent patient
        const querySnapshot = await getDocs(patientQuery);

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setPatientDetails(data);
        } else {
          console.error('No patient data found!');
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    fetchPatientData();
  }, []);

  const generatePDF = () => {
    if (!patientDetails) return;

    const doc = new jsPDF();

    // Add hospital and company logos
    doc.addImage(hospitalLogo, 'JPEG', 10, 10, 40, 40); // Hospital logo on left
    doc.addImage(companyLogo, 'JPEG', 150, 10, 40, 40); // Company logo on right

    // Add patient details
    doc.setFontSize(14);
    doc.text(`Registration Application ID: ${patientDetails.regID}`, 10, 60); // Updated field name based on your structure
    doc.text(`Name: ${patientDetails.patientName}`, 10, 70); // Updated field name based on your structure
    doc.text(`Age: ${patientDetails.age}`, 10, 80); // Assuming age is stored in Firestore
    doc.text(`Date of Birth: ${patientDetails.dob}`, 10, 90); // Assuming DOB is stored in Firestore
    doc.text(`Block: ${patientDetails.block}`, 10, 100); // Assuming block is stored in Firestore
    doc.text(`Hospital Name: ${patientDetails.hospitalName}`, 10, 110); // Assuming hospital name is stored in Firestore

    // Add the result message
    doc.text('RESULT:', 10, 140);
    doc.addImage(greenTick, 'JPEG', 10, 145, 20, 20); // Green tick image
    doc.text('RESULT IS NORMAL', 40, 155);

    // Add a table with diagnostic results
    autoTable(doc, {
      head: [['Test', 'Result']],
      body: [
        ['Normal', 'Positive'],
        ['Diabetes', 'Negative'],
        ['Glaucoma', 'Negative'],
        ['Cataract', 'Negative'],
        ['AMD', 'Negative'],
        ['Hypertension', 'Negative'],
        ['Pathological Myopia', 'Negative'],
        ['Other Abnormalities', 'Negative'],
      ],
      startY: 165,
    });

    // Save the PDF and create a preview URL
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfPreview(pdfUrl);
    doc.save('report.pdf');
  };

  const sendToDoctor = () => {
    // Implement your logic to send the PDF to the doctor
    generatePDF();
    console.log('PDF sent to doctor (implement this feature)');
  };

  // Show a loading state while fetching data
  if (!patientDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center p-8 space-y-6">
      {/* PDF Preview Box */}
      <div className="bg-white p-8 shadow-2xl rounded-lg w-full max-w-xl flex flex-col items-center">
        {pdfPreview && (
          <iframe
            src={pdfPreview}
            style={{ width: '100%', height: '400px', border: 'none' }}
            title="PDF Preview"
          />
        )}
        <div className="flex space-x-4 mt-6">
          <button
            className="bg-teal-500 text-white font-bold py-2 px-4 rounded-md flex items-center hover:bg-teal-600 transition-colors"
            onClick={generatePDF}
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Download
          </button>
          <button
            className="bg-teal-500 text-white font-bold py-2 px-4 rounded-md flex items-center hover:bg-teal-600 transition-colors"
            onClick={sendToDoctor}
          >
            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
            Send to Doctor
          </button>
        </div>
      </div>
    </div>
  );
}
