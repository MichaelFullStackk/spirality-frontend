"use client";

import { useRouter } from 'next/navigation';
import React, { useCallback, useState, useEffect } from 'react';
import axiosInstance from './utils/axiosInstance';
import { useDropzone } from 'react-dropzone';
import Course from './components/course/Course';
import Footer from './components/layout/Footer';
import Profile from './components/profile/Profile';
import axios from 'axios';

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [courses, setCourses] = useState([]);
  const [courseLoading, setCourseLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home'); // Новое состояние для активной секции

  const router = useRouter();
  const fetchCourses = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axiosInstance.post('/course/user_courses', {"token": refreshToken}); // Используем инстанс axios
      const courseIds = response.data.user_courses;
      
      const courseDetailsPromises = courseIds.map(async (id) => {
        const courseResponse = await axiosInstance.get(`/course/${id}/get_topic_id`); // Используем инстанс axios
        return {
          id: courseResponse.data.name_of_course._id,
          name: courseResponse.data.name_of_course.headName,
          topics: courseResponse.data.id_collection,
        };
      });

      const courseDetails = await Promise.all(courseDetailsPromises);
      setCourses(courseDetails);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setCourseLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUploadSuccess(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axiosInstance.put('/auth/userInfo', {"token": refreshToken });
    const user = response.data.user;
    
    const formData = new FormData();
    formData.append('material', file);
    formData.append('token', refreshToken);
    formData.append('user_interest', user.surveyAnswers.join(','));

    try {
      setLoading(true);

      const response = await axiosInstance.post('/course/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { data } = response;
      
      const newTestId = data._id;
      setUploadSuccess(true);
      router.push(`pages/course/course-${newTestId}`);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <img 
              src="https://i.ibb.co/vkqbnCb/spiral-logo-concept-swirl-modern-logo-design-free-vector-Photoroom.png" 
              alt="Spirality Logo" 
              className="h-32 w-32 md:h-30 md:w-30 rotate-animation-loader" 
            />      
          </div>
        )}
        
    {activeSection === 'home' && (
      <section className="bg-[#171819] rounded-2xl p-6 w-full max-w-[90%] md:max-w-3xl mx-auto text-center shadow-2xl shadow-[#2A1E4D] mb-4">
        <h1 className="text-2xl md:text-7xl font-extrabold text-white mb-4 text-center mt-2 md:py-6">
          Загрузи фото учебного материала и мы создадим тебе курс
        </h1>
        <div
          {...getRootProps()}
          className={`bg-[#171819] opacity-55 rounded-lg border-2 border-dashed border-gray-500 p-8 text-white mb-4 mt-2 md:mt-6 md:py-20 ${isDragActive ? 'bg-green-500' : ''}`}
        >
        <input {...getInputProps()} />
        {file ? (
          <div>
            <p>Выбранный файл: {file.name}</p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              Удалить файл
            </button>
          </div>
        ) : isDragActive ? (
          <p>Отпустите файл здесь ...</p>
        ) : (
          <p>Перетащите фото учебного материала сюда или кликните для выбора файла</p>
    )}

</div>
<button 
  className="bg-[#6a4ae2] text-white font-semibold py-2 px-4 rounded-xl md:h-16 md:w-48 transition duration-300 hover:bg-[#8465f1] md:mt-5 md:text-2xl transform hover:-translate-y-1 active:translate-y-0 shadow-lg"
  onClick={handleSubmit}
  disabled={!file}
>
  Сгенерировать
</button>
{uploadSuccess && (
  <p className="text-green-500 mt-4">Файл успешно загружен!</p>
)}
</section>
)}
        
        {activeSection === 'profile' && (
          <Profile />
        )}
        {activeSection === 'courses' && (
          <div className='bg-gradient-to-br from-[#3a3d40] to-[#34495E] rounded-2xl p-6 w-full max-w-[90%] md:max-w-3xl mx-auto text-center mb-4'>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-8 text-start mt-4 md:py-6">
              Твои курсы
            </h1>
            {courseLoading ? (
              <div className="flex items-center justify-center">
                <div className="loader"></div>
              </div>
            ) : (
              courses.map((course) => (
                <Course key={course.id} course_id={course.id} name_of_course={course.name} topics_id={course.topics} isOpen={false} />
              ))
            )}
          </div>
        )}
      </main>

      <Footer activeSection={activeSection} setActiveSection={setActiveSection} />
    </div>
  );
}