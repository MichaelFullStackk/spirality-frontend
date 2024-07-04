"use client"
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import Header from "./components/layout/Header";
import Image from "next/image";
import Box from './components/box/BoxShadow';
import PathNode from './components/layout/PathNode';

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false); // New state for tracking upload success
  const [isAccordionOpen, setIsAccordionOpen] = useState(false); // State for accordion
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setUploadSuccess(false); // Reset upload success when a new file is selected
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('material', file);

    try {
      setLoading(true); // Start loading
      const response = await axios.post('http://localhost:8000/api/tests/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { data } = response;
      const newTestId = data._id; // Assuming the response contains the new test's ID
      setUploadSuccess(true); // Set upload success to true
      router.push(`pages/course/${newTestId}`); // Redirect to the new course page
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center font-ubuntu mb-[0.7rem]">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <img 
            src="https://i.ibb.co/vkqbnCb/spiral-logo-concept-swirl-modern-logo-design-free-vector-Photoroom.png" 
            alt="Spirality Logo" 
            className="h-32 w-32 md:h-30 md:w-30 rotate-animation-loader" 
          />      
        </div>
      )}
      {/* Main Section */}
      <section className="bg-[#171819] rounded-2xl p-6 w-full max-w-[90%] md:max-w-3xl text-center shadow-2xl shadow-[#2A1E4D]">
        <h1 className="text-3xl md:text-7xl font-extrabold text-white mb-4 text-start mt-2 md:py-6">
          Играй & Учись вместе с ИИ
        </h1>
        <div
          {...getRootProps()}
          className={`bg-[#171819] opacity-55 rounded-lg border-2 border-dashed border-gray-500 p-8 text-white mb-4 mt-2 md:mt-6 md:py-20 ${isDragActive ? 'bg-green-500' : ''}`}
        >
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p>Перетащите фото учебного материала сюда и мы сделаем для тебя индивидуальный курс ...</p> :
              <p>Перетащите фото учебного материала сюда и мы сделаем для тебя индивидуальный курс ...</p>
          }
        </div>
        <button 
          className="bg-[#6a4ae2] text-white font-semibold py-2 px-4 rounded-xl md:h-16 md:w-48 transition duration-300 hover:bg-[#8465f1] md:mt-5 md:text-2xl transform hover:-translate-y-1 active:translate-y-0 shadow-lg"
          onClick={handleSubmit}
        >
          Дальше
        </button>
        {uploadSuccess && (
          <p className="text-green-500 mt-4">Файл успешно загружен!</p>
        )}
      </section>

      {/* Profile Section */}
      <div className="bg-[#17181941] rounded-2xl p-6 w-full max-w-[90%] md:max-w-3xl text-center shadow-2xl shadow-black mt-10">
        <div className="flex items-center">
          <img 
            src="https://media.licdn.com/dms/image/D4E03AQE9e2VwuYLvNA/profile-displayphoto-shrink_200_200/0/1705705479349?e=2147483647&v=beta&t=RCFvwsPGyPnNtSB-jeyfGh2rHMhlxMAw311-4skbiWE" 
            alt="Profile Picture" 
            width={50} 
            height={50}  
            className="rounded-full border-2 border-gray-500 md:w-24 md:h-24 md:ml-[11%] ml-2"
          />
          <div className="ml-8 md:ml-32">
            <p className="text-lg md:text-3xl font-semibold">Alidar Panaguzhiyev</p>
            <p className="text-sm md:text-lg text-gray-400">2 level</p>
          </div>
        </div>
        <div className="md:mt-11 mt-5 bg-[#20232676] rounded-2xl p-6 w-full max-w-sm md:max-w-3xl text-center">
          <p className="text-sm md:text-xl font-thin">
            Я учусь на математическом факультете КБТУ и страстно увлечен будущим искусственного интеллекта.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center mt-8 space-y-6">
        <button
          className="bg-[#302f34] h-20 text-white font-semibold py-2 px-4 rounded-xl w-full max-w-[20rem] md:max-w-3xl transition duration-300 hover:bg-[#5c5a65] md:mt-5 md:text-2xl transform hover:-translate-y-1 active:translate-y-0 shadow-lg"
          onClick={() => setIsAccordionOpen(!isAccordionOpen)}
        >
          Начало Отечественной войны против Джунгарской агрессии
        </button>
        <div className={`accordion-content ${isAccordionOpen ? 'open' : 'closed'} w-[20rem]`}>
          <div className='bg-[#171819] rounded-2xl p-6 w-full max-w-[100%] md:max-w-3xl text-center mb-10'>
            <PathNode text="1" completed position="left" />
            <PathNode text="2" completed position="right" />
            <PathNode text="3" position="left" />
            <PathNode text="4" position="right" />
          </div>
        </div>
      </div>
    </main>
  );
}
