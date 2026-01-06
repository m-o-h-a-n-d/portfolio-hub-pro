const Navbar = ({ activePage, onPageChange }) => {
  const pages = ['About', 'Resume', 'Portfolio', 'Blog', 'Contact'];

  return (
    <nav 
      className="fixed bottom-0 left-0 w-full md:relative md:mb-4 backdrop-blur-[10px] border border-border rounded-xl md:rounded-[20px] shadow-portfolio-2 z-50"
      style={{ background: 'hsla(240, 1%, 17%, 0.75)' }}
    >
      <ul className="flex flex-wrap justify-center items-center px-[10px] md:px-4">
        {pages.map((page) => (
          <li key={page}>
            <button
              onClick={() => onPageChange(page.toLowerCase())}
              className={`px-[7px] md:px-4 py-5 text-[11px] md:text-sm transition-colors ${
                activePage === page.toLowerCase()
                  ? 'text-primary'
                  : 'text-light-gray hover:text-light-gray/70'
              }`}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
