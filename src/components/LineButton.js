import React, {useState} from 'react';

const sizes = {
  default: `py-3 px-8`,
  lg: `py-4 px-12`,
  xl: `py-5 px-16 text-lg`
};

const LineButton = ({ children, className = '', size }) => {
  const [hovered, setHovered] = useState(false)

  const styles = {
    background: hovered ? "white" : "Transparent",
    color: hovered ? "#3B5F9E" : "white",
    border: "1px solid white",
    transition: "0.2s"
  }

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
    `}
    >
      {children}
    </button>
  );
};

export default LineButton;
