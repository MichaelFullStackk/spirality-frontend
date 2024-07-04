"use client";

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BoxLesson from '@/app/components/box/BoxLesson';
import Tabs from '@/app/components/tabs/Tabs';
import Skeleton from '@/app/components/skeleton/SkeletonCourse';

const CoursePage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [testCompleted, setTestCompleted] = useState(false);
  const [result, setResult] = useState({ correct: 0, incorrect: 0 });
  const [page, setPage] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentFeedback, setCurrentFeedback] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tests/tests/${id}`);
        setCourse(response.data);
        setUserAnswers(new Array(response.data.test.length).fill(null));
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    if (id) {
      fetchCourseData();
    }
  }, [id]);

  if (!course) {
    return <Skeleton />;
  }

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    if (userAnswers[questionIndex] !== null) return;

    const newUserAnswers = [...userAnswers];
    newUserAnswers[questionIndex] = answerIndex;
    setUserAnswers(newUserAnswers);

    if (course.test[questionIndex].answers[answerIndex] === course.test[questionIndex].correct_answer) {
      setCurrentFeedback('Correct!');
    } else {
      setCurrentFeedback('Incorrect, the correct answer is shown in green.');
    }

    setTimeout(() => {
      setCurrentFeedback(null);
      if (currentQuestion < course.test.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        handleSubmitTest();
      }
    }, 1000);
  };

  const handleSubmitTest = () => {
    let correct = 0;
    let incorrect = 0;

    course.test.forEach((testItem, index) => {
      console.log(testItem.correct_answer);
      
      if (userAnswers[index] === testItem.correct_answer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    setResult({ correct, incorrect });
    setTestCompleted(true);
  };

  const splitTextIntoChunks = (text) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    const chunks = [];
    for (let i = 0; i < sentences.length; i += 4) {
      chunks.push(sentences.slice(i, i + 4).join(' '));
    }
    return chunks;
  };

  const textChunks = splitTextIntoChunks(course.description);

  const renderTest = () => (
    <div className="bg-[#171819] rounded-2xl p-6 w-full max-w-[100%] md:max-w-3xl shadow-2xl shadow-[#2A1E4D] mb-10">
      <h2 className="text-xl md:text-3xl font-bold text-white mb-4 text-center">Тест</h2>
      <div className="mb-4">
        <p className="text-xs md:text-xl font-bold text-white mb-2">{`Вопрос ${currentQuestion + 1} из ${course.test.length}`}</p>
        <p className="text-xs md:text-xl font-bold text-white mb-2">{course.test[currentQuestion].question}</p>
        <ul className="space-y-2">
          {course.test[currentQuestion].answers.map((answer, answerIndex) => (
            <li 
              key={answerIndex} 
              className={`text-xs md:text-lg text-white mb-1 cursor-pointer bg-[#26272B] py-2 px-4 rounded-md 
              ${userAnswers[currentQuestion] === answerIndex ? 'border-2 border-[#6a4ae2]' : ''} 
              ${userAnswers[currentQuestion] !== null && course.test[currentQuestion].answers[answerIndex] === course.test[currentQuestion].correct_answer ? 'bg-green-500' : ''} 
              ${userAnswers[currentQuestion] === answerIndex && course.test[currentQuestion].answers[answerIndex] !== course.test[currentQuestion].correct_answer ? 'bg-red-500' : ''}`}
              onClick={() => handleAnswerSelect(currentQuestion, answerIndex)}
            >
              {answer}
            </li>
          ))}
        </ul>
        {currentFeedback && <p className="text-white mt-2">{currentFeedback}</p>}
      </div>
    </div>
  );

  const renderResult = () => (
    <div className="bg-[#171819] rounded-2xl p-6 w-full max-w-[100%] md:max-w-3xl shadow-2xl shadow-[#2A1E4D] mb-10 text-center text-white">
      <h2 className="text-xl md:text-3xl font-bold mb-4">Результаты теста</h2>
      <p className="text-lg md:text-2xl mb-4">Правильных ответов: {result.correct}</p>
      <p className="text-lg md:text-2xl mb-4">Неправильных ответов: {result.incorrect}</p>
      <ul>
        {course.test.map((testItem, index) => (
          <li key={index} className="text-lg md:text-xl mb-2">
            <p>{testItem.question}</p>
            <p className={`font-bold ${userAnswers[index] === testItem.correct_answer ? 'text-green-500' : 'text-red-500'}`}>
              Ваш ответ: {testItem.answers[userAnswers[index]]}
            </p>
            {userAnswers[index] !== testItem.correct_answer && (
              <p className="text-green-500">
                Правильный ответ: {testItem.answers[testItem.correct_answer]}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  const renderConspect = () => (
    <div className="bg-[#171819] rounded-2xl p-6 w-full max-w-[100%] md:max-w-3xl shadow-2xl shadow-[#2A1E4D] mb-10 text-white">
      <h2 className="text-xl md:text-4xl font-bold mb-4">{course.name}</h2>
      <p className="text-base md:text-2xl mb-10 md:mt-10">{textChunks[page]}</p>
      <div className="flex justify-between items-center">
        <button 
          disabled={page === 0} 
          onClick={() => setPage(page - 1)} 
          className={`bg-[#6a4ae2] text-white font-semibold py-2 px-4 rounded-xl transition duration-300 hover:bg-[#8465f1] ${page === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Назад
        </button>
        <span className="text-white text-base md:text-lg">{`${page + 1}/${textChunks.length}`}</span>
        <button 
          disabled={page === textChunks.length - 1} 
          onClick={() => setPage(page + 1)} 
          className={`bg-[#6a4ae2] text-white font-semibold py-2 px-4 rounded-xl transition duration-300 hover:bg-[#8465f1] ${page === textChunks.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Вперед
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (activeTab === 0) {
      return renderConspect();
    } else if (activeTab === 1) {
      return testCompleted ? renderResult() : renderTest();
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center font-ubuntu mb-[0.7rem] px-4'>
      <Tabs tabs={['Конспект', 'Тест']} activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
    </div>
  );
};

export default CoursePage;
