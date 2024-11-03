import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faCircleRight } from '@fortawesome/free-regular-svg-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function PatientDetails() {
  const router = useRouter(); 
  // State variables for the form and dynamic content
  const [patientName, setPatientName] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [block, setBlock] = useState('Inpatient');
  const [hospitalName, setHospitalName] = useState('General Hospital');
  const [regID] = useState(Math.floor(10000000000000000000 + Math.random() * 90000000000000000000)); // Random Registration ID
  const [regDate] = useState(new Date().toLocaleDateString());

  // Load data from local storage on component mount
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
      localStorage.removeItem('patientData'); // Clear expired data
      localStorage.removeItem('dataExpiration');
    }
  }, []);

  // Calculate age dynamically from DOB
  useEffect(() => {
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let years = today.getFullYear() - birthDate.getFullYear();
      let months = today.getMonth() - birthDate.getMonth();
      
      // Adjust the year and month calculation
      if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
        years--;
        months += 12;
      }
      
      setAge(`${years} Years ${months} Months`);
    }
  }, [dob]);

  // Function to clear form fields
  const clearForm = () => {
    setPatientName('');
    setDob('');
    setBlock('Inpatient');
    setHospitalName('General Hospital');
    setAge('');
    localStorage.removeItem('patientData'); // Clear data from local storage
    localStorage.removeItem('dataExpiration');
  };

  // Function to handle form submission and save data to local storage
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
  
    const data = {regID, patientName, dob, age,regDate, block, hospitalName };
    const expirationTime = new Date().getTime() + 10 * 60 * 1000; // 10 minutes in milliseconds
  
    // Save to local storage (optional, if you still want to use it)
    localStorage.setItem('patientData', JSON.stringify(data));
    localStorage.setItem('dataExpiration', new Date(expirationTime).toISOString());
  
    // Send data to the API
    try {
      const response = await fetch('/api/savePatientData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Ensure `data` is correctly defined
      });
  
      if (!response.ok) {
        throw new Error('Failed to save data');
      }
  
      const result = await response.json();
      console.log(result.message); // Log success message
  
      router.push('/file-upload');

    } catch (error) {
      console.error('Error:', error); // Log any errors
    }
  };
  

  return (
    <div className="flex flex-col p-8 space-y-8"> {/* Stacked with space in between */}
      
      {/* First Div */}
      <div className="bg-white relative p-6 rounded-lg shadow-md">
         <div className="bg-[#003366] flex justify-center items-center p-6 rounded-t-lg text-white relative">
            <h1 className="text-2xl font-bold sm:text-xl md:text-xl ">Welcome {patientName || 'Patient Name'}</h1>
        </div>
        <div className="mt-8">
          <p><strong>Age:</strong> {age || 'N/A'}</p>
          <p><strong>Block:</strong> {block}</p>
          <p><strong>Hospital Name:</strong> {hospitalName}</p>
        </div>
      </div>

      {/* Second Div */}
      <div className="bg-white relative p-6 rounded-lg shadow-md">
  <div className="bg-[#003366] flex justify-center items-center p-6 rounded-t-lg text-white relative">
    <h1 className="text-2xl font-bold sm:text-xl md:text-xl">Patient Details</h1>
        </div>
        <form className="space-y-4 mt-8" onSubmit={(e) => e.preventDefault()}>
          {/* Patient Name */}
          <div>
            <label className="block mb-1">Patient Name</label>
            <input 
              type="text" 
              value={patientName} 
              onChange={(e) => setPatientName(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Registration Application ID */}
          <div>
            <label className="block mb-1">Registration Application ID</label>
            <input 
              type="text" 
              value={regID} 
              readOnly 
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          {/* Date of Registration */}
          <div>
            <label className="block mb-1">Date of Registration</label>
            <input 
              type="text" 
              value={regDate} 
              readOnly 
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          {/* Date of Birth */}
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

          {/* Adhaar Number */}
          <div>
            <label className="block mb-1">Adhaar Number</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block mb-1">Mobile Number</label>
            <input type="text" maxLength="10" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>

          {/* Patient Email ID */}
          <div>
            <label className="block mb-1">Patient Email ID</label>
            <input type="email" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>

          {/* Doctor In-Charge */}
          <div>
            <label className="block mb-1">Doctor In-Charge</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>

          {/* Clear and Done Buttons */}
          <div className="flex justify-between mt-4">
            <button 
              type="button" 
              onClick={clearForm} 
              className="bg-blue-900 text-white py-2 px-4 rounded-md font-bold"
            >
              CLEAR
            </button>
            <Link href="/file-upload">
              <button 
                type="submit" 
                onClick={handleSubmit} // Save data to local storage
                className="bg-green-500 text-white py-2 px-4 rounded-md flex items-center font-bold"
              >
                DONE <FontAwesomeIcon icon={faCircleRight} className="ml-2" />
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
