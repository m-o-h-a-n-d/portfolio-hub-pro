import React from 'react';

const ReactLogoAnimation = ({ size = 'w-24 h-24' }) => {
  return (
    <svg
      className={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>{`
          @keyframes orbit1 {
            0% { 
              transform: rotate(0deg) translateX(30px) rotate(0deg);
              transform-origin: 50px 50px;
            }
            100% { 
              transform: rotate(360deg) translateX(30px) rotate(-360deg);
              transform-origin: 50px 50px;
            }
          }
          @keyframes orbit2 {
            0% { 
              transform: rotate(120deg) translateX(30px) rotate(-120deg);
              transform-origin: 50px 50px;
            }
            100% { 
              transform: rotate(480deg) translateX(30px) rotate(-480deg);
              transform-origin: 50px 50px;
            }
          }
          @keyframes orbit3 {
            0% { 
              transform: rotate(240deg) translateX(30px) rotate(-240deg);
              transform-origin: 50px 50px;
            }
            100% { 
              transform: rotate(600deg) translateX(30px) rotate(-600deg);
              transform-origin: 50px 50px;
            }
          }
          .electron1 {
            animation: orbit1 3s linear infinite;
          }
          .electron2 {
            animation: orbit2 3s linear infinite;
          }
          .electron3 {
            animation: orbit3 3s linear infinite;
          }
        `}</style>
      </defs>

      {/* Nucleus (Center Circle) */}
      <circle
        cx="50"
        cy="50"
        r="3.5"
        fill="currentColor"
        className="text-primary"
      />

      {/* Orbit 1 */}
      <ellipse
        cx="50"
        cy="50"
        rx="30"
        ry="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        className="text-primary/50"
      />

      {/* Orbit 2 */}
      <ellipse
        cx="50"
        cy="50"
        rx="30"
        ry="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        className="text-primary/50"
        transform="rotate(60 50 50)"
      />

      {/* Orbit 3 */}
      <ellipse
        cx="50"
        cy="50"
        rx="30"
        ry="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        className="text-primary/50"
        transform="rotate(120 50 50)"
      />

      {/* Electron 1 */}
      <g className="electron1">
        <circle
          cx="80"
          cy="50"
          r="3"
          fill="currentColor"
          className="text-primary"
        />
      </g>

      {/* Electron 2 */}
      <g className="electron2">
        <circle
          cx="80"
          cy="50"
          r="3"
          fill="currentColor"
          className="text-primary"
        />
      </g>

      {/* Electron 3 */}
      <g className="electron3">
        <circle
          cx="80"
          cy="50"
          r="3"
          fill="currentColor"
          className="text-primary"
        />
      </g>
    </svg>
  );
};

export default ReactLogoAnimation;
