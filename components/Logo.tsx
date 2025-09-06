import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'lg';
}

const Logo = ({ className = '', size = 'lg' }: LogoProps) => {
  const sizeConfig = {
    sm: {
      container: 'text-lg',
      space: 'space-y-0',
      translateX: 'translate-x-6',
      translateY: '-translate-y-1.5',
    },
    lg: {
      container: 'text-4xl',
      space: 'space-y-1',
      translateX: 'translate-x-12',
      translateY: '-translate-y-3',
    },
  };

  const currentSize = sizeConfig[size];

  return (
    <div className={`font-black tracking-wide leading-none select-none ${currentSize.container} ${className}`}>
      <div className={`transform -rotate-12 origin-center ${currentSize.space}`}>
        <div className="text-brand-text">
          <span className="block">FIRA DE LA</span>
          <span className="block">MUNTANYA</span>
        </div>
        <div className={`text-brand-accent transform ${currentSize.translateX} ${currentSize.translateY}`}>
          <span className="block">VIC 2025</span>
        </div>
      </div>
    </div>
  );
};

export default Logo;