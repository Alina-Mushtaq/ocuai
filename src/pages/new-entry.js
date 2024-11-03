import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faCircleRight } from '@fortawesome/free-regular-svg-icons';
import { useRouter } from 'next/router';
import { db } from './firebase/firebaseconfig'; // Adjust the import based on your project structure
import { doc, setDoc } from 'firebase/firestore';

export default function PatientDetails() {
  const router = useRouter(); 
  const [patientName, setPatientName] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [block, setBlock] = useState('Inpatient');
  const [hospitalName, setHospitalName] = useState('General Hospital');
  const [regID] = useState(Math.floor(10000000000000000000 + Math.random() * 90000000000000000000));
  const [regDate] = useState(new Date().toLocaleDateString());

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('patientData'));
    const expiration = localStorage.getItem('dataExpiration');

    if (savedData && expiration && new Date().getTime() < new Date(expiration).getTime()) {
      setPatientName(savedData.patientName);
      setDob(savedData.dob);
      setAge(savedData.age);
      setBlock(savedData.block);
      setHospitalName(savedData.hospitalName);
    } else {
      localStorage.removeItem('patientData');
      localStorage.removeItem('dataExpiration');
    }
  }, []);

  useEffect(() => {
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let years = today.getFullYear() - birthDate.getFullYear();
      let months = today.getMonth() - birthDate.getMonth();
      
      if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
        years--;
        months += 12;
      }
      
      setAge(`${years} Years ${months} Months`);
    }
  }, [dob]);

  const clearForm = () => {
    setPatientName('');
    setDob('');
    setBlock('Inpatient');
    setHospitalName('General Hospital');
    setAge('');
    localStorage.removeItem('patientData');
    localStorage.removeItem('dataExpiration');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add the createdAt field with the current timestamp
    const data = { 
        regID, 
        patientName, 
        dob, 
        age, 
        regDate, 
        block, 
        hospitalName, 
        createdAt: new Date() // Add this line to set the createdAt timestamp
    };
    const expirationTime = new Date().getTime() + 10 * 60 * 1000;

    localStorage.setItem('patientData', JSON.stringify(data));
    localStorage.setItem('dataExpiration', new Date(expirationTime).toISOString());

    try {
        await setDoc(doc(db, 'patients', `${regID}`), data);
        console.log('Data saved successfully:', regID);
        router.push('/file-upload');
    } catch (error) {
        console.error('Error during submission:', error.message); // Log the error message
        console.error('Error details:', error); // Log the full error object
    }
};



  return (
    <div className="flex flex-col p-8 space-y-8">
      <div className="bg-white relative p-6 rounded-lg shadow-md">
        <div className="bg-[#003366] flex justify-center items-center p-6 rounded-t-lg text-white relative">
          <h1 className="text-2xl font-bold sm:text-xl md:text-xl">Welcome {patientName || 'Patient Name'}</h1>
        </div>
        <div className="mt-8">
          <p><strong>Age:</strong> {age || 'N/A'}</p>
          <p><strong>Block:</strong> {block}</p>
          <p><strong>Hospital Name:</strong> {hospitalName}</p>
        </div>
      </div>

      <div className="bg-white relative p-6 rounded-lg shadow-md">
        <div className="bg-[#003366] flex justify-center items-center p-6 rounded-t-lg text-white relative">
          <h1 className="text-2xl font-bold sm:text-xl md:text-xl">Patient Details</h1>
        </div>
        <form className="space-y-4 mt-8" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1">Patient Name</label>
            <input 
              type="text" 
              value={patientName} 
              onChange={(e) => setPatientName(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block mb-1">Registration Application ID</label>
            <input 
              type="text" 
              value={regID} 
              readOnly 
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-1">Date of Registration</label>
            <input 
              type="text" 
              value={regDate} 
              readOnly 
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-1">Date of Birth</label>
            <div className="flex items-center">
              <input 
                type="date" 
                value={dob} 
                onChange={(e) => setDob(e.target.value)} 
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <FontAwesomeIcon icon={faCalendarDays} className="ml-2 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="block mb-1">Aadhaar Number</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>

          <div>
            <label className="block mb-1">Mobile Number</label>
            <input type="text" maxLength="10" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>

          <div>
            <label className="block mb-1">Patient Email ID</label>
            <input type="email" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>

          <div>
            <label className="block mb-1">Doctor In-Charge</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>

          <div className="flex justify-between mt-4">
            <button 
              type="button" 
              onClick={clearForm} 
              className="bg-blue-900 text-white py-2 px-4 rounded-md font-bold"
            >
              CLEAR
            </button>
            <button 
              type="submit" 
              className="bg-green-500 text-white py-2 px-4 rounded-md flex items-center font-bold"
            >
              DONE <FontAwesomeIcon icon={faCircleRight} className="ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
