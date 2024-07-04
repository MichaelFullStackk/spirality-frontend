import React from 'react';
import { FaStar } from 'react-icons/fa'; // Import an icon to indicate clickable nodes

const PathNode = ({ text, completed, position }) => {
  return (
    <div className={`relative flex flex-col items-center ${position}`}>
      <div className={`flex items-center justify-center w-16 h-16 rounded-full ${completed ? 'bg-green-500' : 'bg-gray-300'} shadow-md cursor-pointer hover:scale-105 transition-transform`}>
        <FaStar className="text-white text-2xl" /> {/* Add an icon inside the node */}
      </div>
      <span className="absolute bottom-0 text-white font-bold"></span>
      {/* Add a path segment below the node except for the last node */}
      {text !== '7' && <div className="w-1 h-5 bg-gray-500 mt-2"></div>}
    </div>
  );
};

export default PathNode;
