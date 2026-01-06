import { useState } from 'react';
import { useProfile } from '../../context/DataContext';
import { Mail, Phone, Calendar, MapPin, Facebook, Twitter, Instagram, Linkedin, Github, ChevronDown } from 'lucide-react';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const profile = useProfile();

  if (!profile) return null;

  const socialIcons = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    github: Github,
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <aside 
      className={`bg-card border border-border rounded-[20px] p-4 md:p-[30px] shadow-portfolio-1 z-10 transition-all duration-500 ease-in-out overflow-hidden ${
        isExpanded ? 'max-h-[600px]' : 'max-h-[112px] md:max-h-[180px]'
      }`}
    >
      {/* Top Section - Avatar & Basic Info */}
      <div className="relative flex items-center gap-4 md:gap-[25px]">
        {/* Avatar */}
        <figure 
          className="rounded-[20px] md:rounded-[30px] overflow-hidden flex-shrink-0"
          style={{ background: 'var(--bg-gradient-onyx)' }}
        >
          <img 
            src={profile.avatar} 
            alt={profile.name} 
            className="w-20 md:w-[120px]"
          />
        </figure>

        {/* Name & Title */}
        <div className="flex-1">
          <h1 className="text-white-2 text-[17px] md:text-[26px] font-medium tracking-tight mb-2 md:mb-[15px]">
            {profile.name}
          </h1>
          <p 
            className="bg-onyx text-white-1 text-[11px] md:text-xs font-light px-3 py-1 md:px-[18px] md:py-[5px] rounded-lg w-max"
          >
            {profile.title}
          </p>
        </div>

        {/* Toggle Button */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -top-4 -right-4 md:-top-[30px] md:-right-[30px] rounded-br-[15px] md:rounded-br-[20px] text-primary px-[10px] md:px-[15px] py-[10px] shadow-portfolio-2 z-10 transition-all duration-300 hover:bg-opacity-80"
          style={{ background: 'var(--border-gradient-onyx)' }}
        >
          <span className="hidden md:block text-xs">
            {isExpanded ? 'Hide Contacts' : 'Show Contacts'}
          </span>
          <ChevronDown 
            className={`md:hidden w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </button>
      </div>

      {/* Expandable Section */}
      <div className={`transition-all duration-500 ${isExpanded ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        {/* Separator */}
        <div className="separator my-4 md:my-8" />

        {/* Contact List */}
        <ul className="grid grid-cols-1 gap-4 md:gap-5">
          {/* Email */}
          <li className="flex items-center gap-4">
            <div className="icon-box">
              <Mail className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-light-gray/70 text-[11px] uppercase mb-[2px]">Email</p>
              <a 
                href={`mailto:${profile.email}`} 
                className="text-white-2 text-[13px] truncate block hover:text-primary transition-colors"
              >
                {profile.email}
              </a>
            </div>
          </li>

          {/* Phone */}
          <li className="flex items-center gap-4">
            <div className="icon-box">
              <Phone className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-light-gray/70 text-[11px] uppercase mb-[2px]">Phone</p>
              <a 
                href={`tel:${profile.phone}`} 
                className="text-white-2 text-[13px] hover:text-primary transition-colors"
              >
                {profile.phone}
              </a>
            </div>
          </li>

          {/* Birthday */}
          <li className="flex items-center gap-4">
            <div className="icon-box">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-light-gray/70 text-[11px] uppercase mb-[2px]">Birthday</p>
              <time className="text-white-2 text-[13px]">
                {formatDate(profile.birthday)}
              </time>
            </div>
          </li>

          {/* Location */}
          <li className="flex items-center gap-4">
            <div className="icon-box">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-light-gray/70 text-[11px] uppercase mb-[2px]">Location</p>
              <address className="text-white-2 text-[13px] not-italic">
                {profile.location}
              </address>
            </div>
          </li>
        </ul>

        {/* Separator */}
        <div className="separator my-4 md:my-8" />

        {/* Social Links */}
        <ul className="flex items-center gap-[15px] pl-[7px] pb-1">
          {profile.social?.map((item, index) => {
            const Icon = socialIcons[item.platform] || Facebook;
            return (
              <li key={index}>
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-light-gray/70 text-lg hover:text-light-gray transition-colors block"
                >
                  <Icon className="w-[18px] h-[18px]" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
