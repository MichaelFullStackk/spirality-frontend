"use client"

import React, { useState } from 'react';
import PathNode from "../layout/PathNode";

const Course = ({ name_of_course, course_id, topics_id, isOpen }) => {
    const [isAccordionOpen, setIsAccordionOpen] = useState(isOpen);
    return (
        <div className="mb-8 flex flex-col items-center">
            <button
                className="bg-gradient-to-br from-[#606b77] to-[#34495E] text-white font-bold py-4 px-6 rounded-2xl w-full max-w-[20rem] md:max-w-3xl text-xl md:text-2xl shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-opacity-50 text-center"
                onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            >
                {name_of_course}
            </button>
            {isAccordionOpen && (
                <div className="mt-6 bg-[#171717] rounded-3xl p-6 w-full max-w-[20rem] md:max-w-3xl shadow-lg">
                    <div className="flex flex-col items-center space-y-4">
                        {topics_id.map((topicId, index) => (
                            <PathNode
                                key={index}
                                completed={index < 2}
                                topic_id={topicId}
                                course_id={course_id}
                                isLast={index === topics_id.length - 1}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Course;