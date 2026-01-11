import React from 'react';

const ReactLogoAnimation = ({ size = 'w-24 h-24' }) => {
  return (
    <svg
      className={`${size} animate-spin`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        animationDuration: '4s',
      }}
    >
      <defs>
        <style>{`
          @keyframes orbit1 {
            0% { transform: rotate(0deg) translateX(35px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(35px) rotate(-360deg); }
          }
          @keyframes orbit2 {
            0% { transform: rotate(120deg) translateX(35px) rotate(-120deg); }
            100% { transform: rotate(480deg) translateX(35px) rotate(-480deg); }
          }
          @keyframes orbit3 {
            0% { transform: rotate(240deg) translateX(35px) rotate(-240deg); }
            100% { transform: rotate(600deg) translateX(35px) rotate(-600deg); }
          }
          .electron1 {
            animation: orbit1 4s linear infinite;
            transform-origin: 50px 50px;
          }
          .electron2 {
            animation: orbit2 4s linear infinite;
            transform-origin: 50px 50px;
          }
          .electron3 {
            animation: orbit3 4s linear infinite;
            transform-origin: 50px 50px;
          }
        `}</style>
      </defs>

      {/* Nucleus (Center Circle) */}
      <circle
        cx="50"
        cy="50"
        r="4"
        fill="currentColor"
        className="text-primary"
      />

      {/* Orbit 1 - Very thin */}
      <ellipse
        cx="50"
        cy="50"
        rx="35"
        ry="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        className="text-primary/40"
      />

      {/* Orbit 2 - Very thin */}
      <ellipse
        cx="50"
        cy="50"
        rx="35"
        ry="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        className="text-primary/40"
        transform="rotate(60 50 50)"
      />

      {/* Orbit 3 - Very thin */}
      <ellipse
        cx="50"
        cy="50"
        rx="35"
        ry="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        className="text-primary/40"
        transform="rotate(120 50 50)"
      />

      {/* Electron 1 */}
      <g className="electron1">
        <circle
          cx="85"
          cy="50"
          r="2.5"
          fill="currentColor"
          className="text-primary"
        />
      </g>

      {/* Electron 2 */}
      <g className="electron2">
        <circle
          cx="85"
          cy="50"
          r="2.5"
          fill="currentColor"
          className="text-primary"
        />
      </g>

      {/* Electron 3 */}
      <g className="electron3">
        <circle
          cx="85"
          cy="50"
          r="2.5"
          fill="currentColor"
          className="text-primary"
        />
      </g>
    </svg>
  );
};

export default ReactLogoAnimation;
