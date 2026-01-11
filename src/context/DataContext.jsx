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
  API_CERTIFICATES_LIST,
  API_TEAM_LIST,
  API_SERVICES_LIST,
  API_SETTINGS_GET
} from '../api/endpoints';

// Create contexts for data
const ProfileContext = createContext(null);
const ResumeContext = createContext(null);
const PortfolioContext = createContext(null);
const BlogContext = createContext(null);
const ServicesContext = createContext(null);
const CertificatesContext = createContext(null);
const TeamContext = createContext(null);
const SettingsContext = createContext(null);

// Custom hooks for accessing data
export const useProfile = () => useContext(ProfileContext);
export const useResume = () => useContext(ResumeContext);
export const usePortfolio = () => useContext(PortfolioContext);
export const useBlog = () => useContext(BlogContext);
export const useServices = () => useContext(ServicesContext);
export const useCertificates = () => useContext(CertificatesContext);
export const useTeam = () => useContext(TeamContext);
export const useSettings = () => useContext(SettingsContext);

// Data Provider Component
export const DataProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [blog, setBlog] = useState(null);
  const [services, setServices] = useState(null);
  const [certificates, setCertificates] = useState(null);
  const [team, setTeam] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        const [
          profileRes,
          resumeOrderRes,
          eduRes,
          expRes,
          skillsRes,
          portfolioRes,
          blogRes,
          certificatesRes,
          teamRes,
          servicesRes,
          settingsRes
        ] = await Promise.all([
          apiGet(API_PROFILE_GET),
          apiGet(API_RESUME_GET),
          apiGet(API_EDUCATION_GET),
          apiGet(API_EXPERIENCE_GET),
          apiGet(API_SKILLS_GET),
          apiGet(API_PORTFOLIO_LIST),
          apiGet(API_BLOG_LIST),
          apiGet(API_CERTIFICATES_LIST),
          apiGet(API_TEAM_LIST),
          apiGet(API_SERVICES_LIST),
          apiGet(API_SETTINGS_GET)
        ]);

        // Reconstruct the resume object based on the order array and individual data
        const order = resumeOrderRes.data || ["education", "experience", "skills"];
        const reconstructedResume = order.map(type => {
          if (type === 'education') return { type: 'education', data: eduRes.data || [] };
          if (type === 'experience') return { type: 'experience', data: expRes.data || [] };
          if (type === 'skills') return { type: 'skills', data: skillsRes.data || [] };
          return { type, data: [] };
        });

        setProfile(profileRes.data);
        setResume(reconstructedResume);
        setPortfolio(portfolioRes.data);
        setBlog(blogRes.data);
        setCertificates(certificatesRes.data);
        setTeam(teamRes.data);
        setServices(servicesRes.data);
        setSettings(settingsRes.data);

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
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          {/* React Logo Animation */}
          <div className="flex items-center justify-center mb-8">
            <svg
              className="w-24 h-24 animate-spin"
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
          <p className="text-muted-foreground text-lg font-medium">Loading portfolio...</p>
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
                <CertificatesContext.Provider value={certificates}>
                  <TeamContext.Provider value={team}>
                    {children}
                  </TeamContext.Provider>
                </CertificatesContext.Provider>
              </ServicesContext.Provider>
            </BlogContext.Provider>
          </PortfolioContext.Provider>
        </ResumeContext.Provider>
      </ProfileContext.Provider>
    </SettingsContext.Provider>
  );
};
