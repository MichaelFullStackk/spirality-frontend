"use client"

import React, { useState, useEffect } from 'react';
import { FaCrown, FaLock, FaBook } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const PathNode = ({ topic_id, course_id, isLast }) => {
  const router = useRouter();
  const [topicData, setTopicData] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const fetchTopicData = async () => {
      try {
        const response = await axios.get(`https://spirality-backend-production.up.railway.app/api/course/${course_id}`);
        const courseData = response.data;
        const topic = courseData.topics.find(t => t._id === topic_id);
        
        if (topic) {
          setTopicData(topic);
          // Проверяем, доступен ли урок
          const topicIndex = courseData.topics.findIndex(t => t._id === topic_id);
          setIsAvailable(topicIndex === 0 || courseData.topics[topicIndex - 1].is_completed);
        }
      } catch (error) {
        console.error('Error fetching topic data:', error);
      }
    };

    fetchTopicData();
  }, [course_id, topic_id]);

  const handleClick = () => {
    if (isAvailable) {
      router.push(`https://spirality-backend-production.up.railway.app/pages/lesson/course-${course_id}&lesson-${topic_id}`);
    }
  };

  if (!topicData) return null;

  return (
    <div className="flex flex-col items-center">
      <button 
        onClick={handleClick}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none ${
          topicData.is_completed ? 'bg-[#58CC02] text-white cursor-pointer' : 
          isAvailable ? 'bg-[#FFC300] text-white cursor-pointer' :
          'bg-[#E5E5E5] text-gray-400 cursor-not-allowed'
        }`}
        disabled={!isAvailable}
      >
        {topicData.is_completed ? <FaCrown className="text-2xl" /> : 
         isAvailable ? <FaBook className='text-2xl' /> : <FaLock className="text-2xl" />}
      </button>
      <div className="mt-2 text-center text-sm text-white">{topicData.topic}</div>
      {!isLast && (
        <div className={`w-1 h-8 ${topicData.is_completed ? 'bg-[#58CC02]' : 'bg-[#E5E5E5]'} my-2`}></div>
      )}
    </div>
  );
};

export default PathNode;