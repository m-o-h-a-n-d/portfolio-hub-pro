import { useState } from 'react';
import { DataProvider } from '../../context/DataContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AboutSection from './AboutSection';
import ResumeSection from './ResumeSection';
import PortfolioSection from './PortfolioSection';
import BlogSection from './BlogSection';
import ContactSection from './ContactSection';

const PortfolioLayout = () => {
  const [activePage, setActivePage] = useState('about');

  const renderPage = () => {
    switch (activePage) {
      case 'about':
        return <AboutSection />;
      case 'resume':
        return <ResumeSection />;
      case 'portfolio':
        return <PortfolioSection />;
      case 'blog':
        return <BlogSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return <AboutSection />;
    }
  };

  return (
    <DataProvider>
      <main className="m-[15px_12px_75px] md:my-[60px] md:mb-[100px] min-w-[259px]">
        <div className="max-w-[1200px] mx-auto lg:flex lg:items-start lg:gap-[25px]">
          {/* Sidebar */}
          <div className="lg:w-[300px] lg:flex-shrink-0 lg:sticky lg:top-[60px]">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Navbar */}
            <Navbar activePage={activePage} onPageChange={setActivePage} />

            {/* Content Area */}
            <div 
              className="bg-card border border-border rounded-[20px] p-[15px] md:p-[30px] shadow-portfolio-1 min-h-[400px]"
            >
              {renderPage()}
            </div>
          </div>
        </div>
      </main>
    </DataProvider>
  );
};

export default PortfolioLayout;
