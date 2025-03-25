import React from 'react';
import Tooltip from './Tooltip';

interface InfoTipProps {
  content: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  width?: string;
}

const InfoTip: React.FC<InfoTipProps> = ({ content, position = 'bottom', width }) => {
  return (
    <Tooltip content={content} position={position} width={width}>
      <div className="inline-flex items-center justify-center w-5 h-5 ml-1 text-blue-500 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded-full cursor-help">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
        </svg>
      </div>
    </Tooltip>
  );
};

export default InfoTip; 