import { useState, useEffect, createContext, useContext } from 'react';
import { apiGet } from '../api/request';

// Create contexts for data
const ProfileContext = createContext(null);
const ResumeContext = createContext(null);
const PortfolioContext = createContext(null);
const BlogContext = createContext(null);
const ServicesContext = createContext(null);
const TestimonialsContext = createContext(null);
const ClientsContext = createContext(null);

// Custom hooks for accessing data
export const useProfile = () => useContext(ProfileContext);
export const useResume = () => useContext(ResumeContext);
export const usePortfolio = () => useContext(PortfolioContext);
export const useBlog = () => useContext(BlogContext);
export const useServices = () => useContext(ServicesContext);
export const useTestimonials = () => useContext(TestimonialsContext);
export const useClients = () => useContext(ClientsContext);

// Data Provider Component
export const DataProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [blog, setBlog] = useState(null);
  const [services, setServices] = useState(null);
  const [testimonials, setTestimonials] = useState(null);
  const [clients, setClients] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        const [
          profileRes,
          resumeRes,
          portfolioRes,
          blogRes,
          servicesRes,
          testimonialsRes,
          clientsRes
        ] = await Promise.all([
          apiGet('/profile'),
          apiGet('/resume'),
          apiGet('/portfolio'),
          apiGet('/blog'),
          apiGet('/services'),
          apiGet('/testimonials'),
          apiGet('/clients')
        ]);

        setProfile(profileRes.data);
        setResume(resumeRes.data);
        setPortfolio(portfolioRes.data);
        setBlog(blogRes.data);
        setServices(servicesRes.data);
        setTestimonials(testimonialsRes.data);
        setClients(clientsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-destructive">
          <p>Error loading data: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <ProfileContext.Provider value={profile}>
      <ResumeContext.Provider value={resume}>
        <PortfolioContext.Provider value={portfolio}>
          <BlogContext.Provider value={blog}>
            <ServicesContext.Provider value={services}>
              <TestimonialsContext.Provider value={testimonials}>
                <ClientsContext.Provider value={clients}>
                  {children}
                </ClientsContext.Provider>
              </TestimonialsContext.Provider>
            </ServicesContext.Provider>
          </BlogContext.Provider>
        </PortfolioContext.Provider>
      </ResumeContext.Provider>
    </ProfileContext.Provider>
  );
};
