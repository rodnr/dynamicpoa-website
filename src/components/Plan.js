import React from 'react';

const Plan = ({ className, children }) => (
  <div
    className={`bg-white rounded-lg border border-solid border-gray-200 ${className}`}
    style={{
      boxShadow: '0 10px 28px rgba(0,0,0,.08)'
    }}
  >
    {children}
  </div>
);

export default Plan;
