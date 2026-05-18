import React, { useState, useEffect } from 'react';

const Alert = ({ message = '', type = 'info', duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  if (!isVisible || !message) {
    return null;
  }

  let backgroundColor = 'bg-gray-200';
  let textColor = 'text-gray-800';

  switch (type) {
    case 'success':
      backgroundColor = 'bg-green-200';
      textColor = 'text-green-800';
      break;
    case 'error':
      backgroundColor = 'bg-red-200';
      textColor = 'text-red-800';
      break;
    case 'warning':
      backgroundColor = 'bg-yellow-200';
      textColor = 'text-yellow-800';
      break;
    case 'info':
      backgroundColor = 'bg-blue-200';
      textColor = 'text-blue-800';
      break;
    default:
      break;
  }

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`px-6 py-3 rounded shadow-md transition-all duration-300 ${backgroundColor} ${textColor}`}
      >
        {message}
      </div>
    </div>
  );
};

export default Alert;
