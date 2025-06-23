import React from 'react';
import { useReadingProgress } from '../hooks/useScrollAnimation';

const ReadingProgress = () => {
  const progress = useReadingProgress();

  return (
    <div 
      className="reading-progress"
      style={{ width: `${progress}%` }}
    />
  );
};

export default ReadingProgress;
