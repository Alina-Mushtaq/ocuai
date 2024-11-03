import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { db } from '../firebase/firebaseconfig'; // Adjust the path as necessary
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export default function PDFPage() {
  const [patientDetails, setPatientDetails] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);

  const hospitalLogo = 'https://as1.ftcdn.net/v2/jpg/03/24/58/44/1000_F_324584485_qtdluDzmBNkJvmntEPlNeG1htwPktgCa.jpg'; // Hospital logo URL
  const companyLogo = 'https://media.licdn.com/dms/image/v2/D560BAQE7Z47nmJKaZw/company-logo_200_200/company-logo_200_200/0/1699535481008?e=2147483647&v=beta&t=9GOT-8N2oX_kfrbxFW728AiXtN4qhNhkCgAyZTEwoEE'; // Company logo URL
  const greenTick = 'https://as1.ftcdn.net/v2/jpg/05/57/72/02/1000_F_557720237_tKXQE4MGcQdFDMcsP3nTyYQ3Ia0T1qE9.jpg'; // Green tick image URL
  const cancelIcon = 'https://media.istockphoto.com/id/1151657492/vector/vector-red-prohibition-sign-no-symbol-isolated-on-white-background.jpg?s=1024x1024&w=is&k=20&c=edr6a2T-_8QUhCJUdP_7srzXhylNB0NjuLRGGrbAjao='; // Icon for abnormal result

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
    doc.text(`Registration Application ID: ${patientDetails.regID}`, 10, 60);
    doc.text(`Name: ${patientDetails.patientName}`, 10, 70);
    doc.text(`Age: ${patientDetails.age}`, 10, 80);
    doc.text(`Date of Birth: ${patientDetails.dob}`, 10, 90);
    doc.text(`Block: ${patientDetails.block}`, 10, 100);
    doc.text(`Hospital Name: ${patientDetails.hospitalName}`, 10, 110);
  
    // Determine result message and icon
    const isNormal = patientDetails.condition === 'Normal (N)';
    const resultText = isNormal ? 'RESULT IS NORMAL' : 'RESULT IS ABNORMAL';
    const resultIcon = isNormal ? greenTick : cancelIcon;
  
    // Only show the result section if the result is abnormal
    if (!isNormal) {
      doc.text('RESULT:', 10, 140);
      doc.addImage(resultIcon, 'JPEG', 10, 145, 20, 20);
      doc.text(resultText, 40, 155);
    } else {
      // If normal, add only the normal result
      doc.text('RESULT:', 10, 140);
      doc.addImage(greenTick, 'JPEG', 10, 145, 20, 20);
      doc.text(resultText, 40, 155);
    }
  
    // Define diagnostic tests and results
    const tests = [
      { label: 'Normal', condition: patientDetails.condition, expected: 'Normal (N)' },
      { label: 'Diabetes', condition: patientDetails.condition, expected: 'Diabetes (D)' },
      { label: 'Glaucoma', condition: patientDetails.condition, expected: 'Glaucoma (G)' },
      { label: 'Cataract', condition: patientDetails.condition, expected: 'Cataract (C)' },
      { label: 'AMD', condition: patientDetails.condition, expected: 'Age related Macular Degeneration (A)' },
      { label: 'Hypertension', condition: patientDetails.condition, expected: 'Hypertension (H)' },
      { label: 'Pathological Myopia', condition: patientDetails.condition, expected: 'Pathological Myopia (M)' },
      { label: 'Other Abnormalities', condition: patientDetails.condition, expected: 'Other diseases/abnormalities (O)' },
    ];
  
    // Create table data dynamically
    const tableData = tests.map(test => ({
      label: test.label,
      result: test.condition === test.expected ? 'Positive' : 'Negative',
    }));
  
    // Create the table
    autoTable(doc, {
      head: [['Test', 'Result']],
      body: tableData.map(item => [item.label, item.result]),
      startY: isNormal ? 165 : 185, // Adjust starting Y based on if the result is normal or abnormal
    });
  
    // Save and preview the PDF
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfPreview(pdfUrl);
    doc.save('report.pdf');
  };

  const sendToDoctor = () => {
    generatePDF();
    console.log('PDF sent to doctor (implement this feature)');
  };

  // Show loading state while fetching data
  if (!patientDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center p-8 space-y-6">
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
