import Image from "next/image";
import localFont from "next/font/local";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard as faRegularAddressCard } from '@fortawesome/free-regular-svg-icons';
import { faIdCardClip } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'; // Importing the angle-right icon
import { faClipboardList } from '@fortawesome/free-solid-svg-icons'; // Importing Reports icon
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons'; // Importing How to Use icon
import { faHeadset } from '@fortawesome/free-solid-svg-icons'; // Importing Support icon
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link'; // Import Next.js Link

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// pages/index.js

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      {/* Header Section */}
      <div className="hidden md:block mb-8">
        <h1 className="text-4xl font-bold text-white">Welcome to OcuAI!</h1>
        <p className="text-lg text-white">One stop solution for most of the ocular disease prevention</p>
      </div>

      {/* Registration Section */}
      <div className="flex flex-col md:flex-row w-full max-w-full p-4 space-y-4 md:space-y-0 md:space-x-2 justify-between">
      {/* New Entry Box */}
      <Link href="/new-entry">
      <div className="flex flex-1 justify-between items-center w-full md:w-[45vw] p-6 bg-white shadow rounded-lg border-b-4 border-[#A8C8A1] cursor-pointer" style={{ minHeight: "150px" }}>
          <div className="flex items-center">
            {/* Font Awesome Icon for New Entry */}
            <FontAwesomeIcon icon={faRegularAddressCard} className="h-12 w-12 text-gray-500 mr-2" />
            <span className="font-bold text-xl ml-4">New Entry</span> {/* Added margin-left */}
          </div>
          <FontAwesomeIcon icon={faAngleRight} className="text-gray-500" />
        </div>
      </Link>

      {/* Registered Entry Box */}
      <Link href="/registered-entry">
      <div className="flex flex-1 justify-between items-center w-full md:w-[45vw] p-6 bg-white shadow rounded-lg border-b-4 border-[#A8C8A1] cursor-pointer" style={{ minHeight: "150px" }}>
          <div className="flex items-center">
            {/* Font Awesome Icon for Registered Entry */}
            <FontAwesomeIcon icon={faIdCardClip} className="h-12 w-12 text-gray-500 mr-2" />
            <span className="font-bold text-xl ml-4">Registered Entry</span> {/* Added margin-left */}
          </div>
          <FontAwesomeIcon icon={faAngleRight} className="text-gray-500" />
        </div>
      </Link>
    </div>

      {/* Others Section */}
      <div className="mt-8 w-full max-w-5xl p-4">
        <h2 className="text-2xl font-bold mb-4 text-white">Others</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 justify-items-center"> {/* Centered the boxes */}
          {/* Box 1 */}
          <Link href="/reports">
            <div className="flex flex-col items-center justify-center p-6 bg-white shadow rounded-lg h-32 w-32 cursor-pointer">
              <FontAwesomeIcon icon={faClipboardList} className="h-8 w-8 text-purple-500 mb-2" />
              <span className="whitespace-nowrap">Reports</span> {/* Prevent text wrapping */}
            </div>
          </Link>

          {/* Box 2 */}
          <Link href="/how-to-use">
            <div className="flex flex-col items-center justify-center p-6 bg-white shadow rounded-lg h-32 w-32 cursor-pointer">
              <FontAwesomeIcon icon={faCircleQuestion} className="h-8 w-8 text-purple-500 mb-2" />
              <span className="whitespace-nowrap">How to use</span> {/* Prevent text wrapping */}
            </div>
          </Link>

          {/* Box 3 */}
          <Link href="/support">
            <div className="flex flex-col items-center justify-center p-6 bg-white shadow rounded-lg h-32 w-32 cursor-pointer">
              <FontAwesomeIcon icon={faHeadset} className="h-8 w-8 text-purple-500 mb-2" />
              <span className="whitespace-nowrap">Support</span> {/* Prevent text wrapping */}
            </div>
          </Link>

          {/* Box 4 */}
          <Link href="/user-settings">
            <div className="flex flex-col items-center justify-center p-6 bg-white shadow rounded-lg h-32 w-32 cursor-pointer">
              <FontAwesomeIcon icon={faUser} className="h-8 w-8 text-purple-500 mb-2" />
              <span className="whitespace-nowrap">User Settings</span> {/* Prevent text wrapping */}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
