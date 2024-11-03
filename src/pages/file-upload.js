import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft, faEye } from '@fortawesome/free-regular-svg-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function FileUpload() {
  const router = useRouter();
  const [leftEyeFile, setLeftEyeFile] = useState(null);
  const [rightEyeFile, setRightEyeFile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLeftEyeUpload = (e) => {
    if (e.target.files.length > 0) {
      setLeftEyeFile(e.target.files[0]);
    }
  };

  const handleRightEyeUpload = (e) => {
    if (e.target.files.length > 0) {
      setRightEyeFile(e.target.files[0]);
    }
  };

  const handleScan = () => {
    setIsModalVisible(true);
  };

  const handleGenerate = async () => {
    const formData = new FormData();
    formData.append('left_eye', leftEyeFile);
    formData.append('right_eye', rightEyeFile);
  
    setIsLoading(true); // Start loading state
    try {
      const response = await fetch('http://localhost:3000/upload/', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        alert(result.message); // Success message from backend
      } else {
        alert('Error in processing the images.'); // Alert error message
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.'); // Alert error message
    } finally {
      setIsLoading(false); // End loading state
      setIsModalVisible(false); // Close modal after generation
      
      // Wait for 3 seconds before redirecting to the result page
      setTimeout(() => {
        router.push('/result'); // Redirect to the result page
      }, 3000); // 3000 ms = 3 seconds
    }
  };
  
  return (
    <div className="flex flex-col items-center p-8 space-y-8">
      <div className="flex items-center mb-4">
        <Link href="/previous-page">
          <FontAwesomeIcon 
            icon={faCircleLeft} 
            className="text-blue-500 text-2xl cursor-pointer" 
          />
        </Link>
        <h1 className="text-3xl font-bold ml-4">SCAN</h1>
      </div>

      <div className="bg-white relative p-6 rounded-lg shadow-md w-full max-w-lg">
        <div className="bg-[#003366] flex justify-center items-center p-6 rounded-t-lg text-white">
          <h1 className="text-2xl font-bold">Upload Image</h1> 
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 justify-center items-center">
          <div className="bg-gray-200 border border-gray-300 rounded-lg flex flex-col items-center p-4 mx-auto" style={{ width: '200px', height: '200px' }}>
            <h2 className="text-center text-xl font-semibold">L</h2>
            <FontAwesomeIcon icon={faEye} className="text-gray-800 text-4xl my-4" />
            <input 
              type="file" 
              onChange={handleLeftEyeUpload}
              className="hidden" 
              id="left-eye-upload"
              accept="image/*"
            />
            <label 
              htmlFor="left-eye-upload" 
              className="bg-purple-500 text-white py-2 px-4 rounded-md cursor-pointer"
            >
              {leftEyeFile ? 'File Uploaded' : 'Choose File'}
            </label>
          </div>

          <div className="bg-gray-200 border border-gray-300 rounded-lg flex flex-col items-center p-4 mx-auto" style={{ width: '200px', height: '200px' }}>
            <h2 className="text-center text-xl font-semibold">R</h2>
            <FontAwesomeIcon icon={faEye} className="text-gray-800 text-4xl my-4" />
            <input 
              type="file" 
              onChange={handleRightEyeUpload}
              className="hidden"
              id="right-eye-upload"
              accept="image/*"
            />
            <label 
              htmlFor="right-eye-upload" 
              className="bg-purple-500 text-white py-2 px-4 rounded-md cursor-pointer"
            >
              {rightEyeFile ? 'File Uploaded' : 'Choose File'}
            </label>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button 
            onClick={handleScan}
            disabled={!leftEyeFile || !rightEyeFile}
            className={`py-2 px-6 rounded-lg text-lg font-bold ${!leftEyeFile || !rightEyeFile ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#003366] text-white cursor-pointer'}`}
          >
            Scan
          </button>
        </div>
      </div>

      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold mb-4">The Retinal Images have been scanned successfully.</h2>
            <p className="mb-6">Press the button below to generate the report.</p>
            <button 
              onClick={handleGenerate} 
              className="bg-green-700 text-white py-2 px-6 rounded-lg text-lg font-bold"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
