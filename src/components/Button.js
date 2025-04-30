#202A45import React, { useState } from 'react';

const sizes = {
  default: `py-3 px-8`,
  lg: `py-4 px-12`,
  xl: `py-5 px-16 text-lg`
};

const Button = ({ children, className = '', size, marginTop = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const [margin, setMargin] = useState(marginTop);

  const styles = {
    background: hovered ? '#243066' : 'linear-gradient(29deg, #202A45, #3B5F9E 70%)',
    marginTop: margin ? `${marginTop}px` : ''
  };

  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={styles}
      className={`
        ${sizes[size] || sizes.default}
        ${className}
        rounded
        text-white
    `}
    >
      {children}
    </button>
  );
};

export default Button;
