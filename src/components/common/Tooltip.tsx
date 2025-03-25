import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'right' | 'bottom' | 'left';
  width?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top',
  width = '250px'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  
  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    
    let x = 0;
    let y = 0;
    
    switch (position) {
      case 'top':
        x = rect.left + rect.width / 2;
        y = rect.top;
        break;
      case 'right':
        x = rect.right;
        y = rect.top + rect.height / 2;
        break;
      case 'bottom':
        x = rect.left + rect.width / 2;
        y = rect.bottom;
        break;
      case 'left':
        x = rect.left;
        y = rect.top + rect.height / 2;
        break;
    }
    
    setCoords({ x, y });
    setIsVisible(true);
  };
  
  const handleMouseLeave = () => {
    setIsVisible(false);
  };
  
  const tooltipStyles: React.CSSProperties = {
    position: 'fixed',
    zIndex: 1000,
    width,
    padding: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    borderRadius: '4px',
    fontSize: '14px',
    pointerEvents: 'none',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    transform: 'translate(-50%, -100%)',
    left: `${coords.x}px`,
    top: `${coords.y - 8}px`,
    maxWidth: '90vw',
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.15s ease-in-out',
    marginBottom: '8px',
  };
  
  if (position === 'bottom') {
    tooltipStyles.transform = 'translate(-50%, 0)';
    tooltipStyles.top = `${coords.y + 8}px`;
    tooltipStyles.marginTop = '8px';
    tooltipStyles.marginBottom = '0';
  } else if (position === 'left') {
    tooltipStyles.transform = 'translate(-100%, -50%)';
    tooltipStyles.left = `${coords.x - 8}px`;
    tooltipStyles.top = `${coords.y}px`;
    tooltipStyles.marginRight = '8px';
    tooltipStyles.marginBottom = '0';
  } else if (position === 'right') {
    tooltipStyles.transform = 'translate(0, -50%)';
    tooltipStyles.left = `${coords.x + 8}px`;
    tooltipStyles.top = `${coords.y}px`;
    tooltipStyles.marginLeft = '8px';
    tooltipStyles.marginBottom = '0';
  }
  
  const childWithProps = React.cloneElement(children, {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  });
  
  return (
    <>
      {childWithProps}
      {isVisible && createPortal(
        <div style={tooltipStyles}>
          {content}
        </div>,
        document.body
      )}
    </>
  );
};

export default Tooltip; 