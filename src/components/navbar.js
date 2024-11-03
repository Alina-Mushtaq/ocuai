// components/Navbar.js
"use client"
import { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-purple-700 text-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-xl font-bold">OcuAI</h1>
        <div className="hidden md:flex space-x-4">
          <Link href="/">Home</Link>
          <Link href="https://www.versalgo.in">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <button onClick={toggleMenu} className="md:hidden">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
      <div
        className={`fixed inset-0 bg-purple-800 bg-opacity-75 z-50 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <button onClick={toggleMenu} className="absolute top-4 right-4 text-white">
            X
          </button>
          <Link href="/" className="text-lg my-4" onClick={toggleMenu}>
            Home
          </Link>
          <Link href="/about" className="text-lg my-4" onClick={toggleMenu}>
            About
          </Link>
          <Link href="/services" className="text-lg my-4" onClick={toggleMenu}>
            Services
          </Link>
          <Link href="/contact" className="text-lg my-4" onClick={toggleMenu}>
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
