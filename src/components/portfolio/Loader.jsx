const Loader = () => { 
  return (
    <div className="flex items-center justify-center h-64">
      <svg
        className="w-16 h-16 animate-spin"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          animationDuration: '3s',
        }}
      >
        {/* React Logo */}
        <circle
          cx="12"
          cy="12"
          r="2"
          fill="currentColor"
          className="text-primary"
        />
        {/* Electron orbits */}
        <ellipse
          cx="12"
          cy="12"
          rx="8"
          ry="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary/60"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="8"
          ry="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary/60"
          transform="rotate(60 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="8"
          ry="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary/60"
          transform="rotate(120 12 12)"
        />
        {/* Electrons */}
        <circle
          cx="20"
          cy="12"
          r="1.5"
          fill="currentColor"
          className="text-primary"
        />
        <circle
          cx="8"
          cy="16"
          r="1.5"
          fill="currentColor"
          className="text-primary"
        />
        <circle
          cx="8"
          cy="8"
          r="1.5"
          fill="currentColor"
          className="text-primary"
        />
      </svg>
    </div>
  );
};

export default Loader;
