import { useState, useEffect, createContext, useContext } from 'react';
import { apiGet } from '../api/request';
import { 
  API_PROFILE_GET, 
  API_RESUME_GET, 
  API_EDUCATION_GET, 
  API_EXPERIENCE_GET, 
  API_SKILLS_GET,
  API_PORTFOLIO_LIST,
  API_BLOG_LIST,
  API_TESTIMONIALS_LIST,
  API_CLIENTS_LIST,
  API_SETTINGS_GET
} from '../api/endpoints';

// Create contexts for data
const ProfileContext = createContext(null);
const ResumeContext = createContext(null);
const PortfolioContext = createContext(null);
const BlogContext = createContext(null);
const ServicesContext = createContext(null);
const TestimonialsContext = createContext(null);
const ClientsContext = createContext(null);
const SettingsContext = createContext(null);

// Custom hooks for accessing data
export const useProfile = () => useContext(ProfileContext);
export const useResume = () => useContext(ResumeContext);
export const usePortfolio = () => useContext(PortfolioContext);
export const useBlog = () => useContext(BlogContext);
export const useServices = () => useContext(ServicesContext);
export const useTestimonials = () => useContext(TestimonialsContext);
export const useClients = () => useContext(ClientsContext);
export const useSettings = () => useContext(SettingsContext);

// Data Provider Component
export const DataProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [blog, setBlog] = useState(null);
  const [services, setServices] = useState(null);
  const [testimonials, setTestimonials] = useState(null);
  const [clients, setClients] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        const [
          profileRes,
          resumeStructureRes,
          eduRes,
          expRes,
          skillsRes,
          portfolioRes,
          blogRes,
          testimonialsRes,
          clientsRes,
          settingsRes
        ] = await Promise.all([
          apiGet(API_PROFILE_GET),
          apiGet(API_RESUME_GET),
          apiGet(API_EDUCATION_GET),
          apiGet(API_EXPERIENCE_GET),
          apiGet(API_SKILLS_GET),
          apiGet(API_PORTFOLIO_LIST),
          apiGet(API_BLOG_LIST),
          apiGet(API_TESTIMONIALS_LIST),
          apiGet(API_CLIENTS_LIST),
          apiGet(API_SETTINGS_GET)
        ]);

        // Reconstruct the resume object based on structure and individual data
        const structure = resumeStructureRes.data || [];
        const reconstructedResume = structure.map(section => {
          if (section.type === 'education') return { ...section, data: eduRes.data || [] };
          if (section.type === 'experience') return { ...section, data: expRes.data || [] };
          if (section.type === 'skills') return { ...section, data: skillsRes.data || [] };
          return section;
        });

        setProfile(profileRes.data);
        setResume(reconstructedResume);
        setPortfolio(portfolioRes.data);
        setBlog(blogRes.data);
        setTestimonials(testimonialsRes.data);
        setClients(clientsRes.data);
        setSettings(settingsRes.data);
        
        // Services might be part of settings or profile in some versions, 
        // but here we'll set it if it exists in any response or keep it null
        setServices(null); 

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
    <SettingsContext.Provider value={settings}>
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
    </SettingsContext.Provider>
  );
};
