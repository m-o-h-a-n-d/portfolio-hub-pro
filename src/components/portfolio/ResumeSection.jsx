import { useResume, useProfile } from '../../context/DataContext';
import { BookOpen, Briefcase, Download } from 'lucide-react';

const ResumeSection = () => {
  const resume = useResume();
  const profile = useProfile();

  if (!resume) return null;

  return (
    <article className="animate-fade-in">
      {/* Title */}
      <header>
        <h2 className="h2 article-title">Resume</h2>
      </header>

      {/* Education */}
      <section className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="icon-box">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="h3">Education</h3>
        </div>

        <ol className="ml-16 md:ml-[65px]">
          {resume.education?.map((item, index) => (
            <li 
              key={item.id} 
              className={`timeline-item ${index !== resume.education.length - 1 ? 'pb-5' : ''}`}
            >
              <h4 className="h4 mb-2 leading-tight">{item.title}</h4>
              <span className="text-vegas-gold font-normal leading-relaxed block mb-2">
                {item.period}
              </span>
              <p className="text-light-gray font-light leading-relaxed text-sm">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Experience */}
      <section className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="icon-box">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="h3">Experience</h3>
        </div>

        <ol className="ml-16 md:ml-[65px]">
          {resume.experience?.map((item, index) => (
            <li 
              key={item.id} 
              className={`timeline-item ${index !== resume.experience.length - 1 ? 'pb-5' : ''}`}
            >
              <h4 className="h4 mb-2 leading-tight">{item.title}</h4>
              <span className="text-vegas-gold font-normal leading-relaxed block mb-2">
                {item.period}
              </span>
              <p className="text-light-gray font-light leading-relaxed text-sm">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Skills */}
      <section className="mb-8">
        <h3 className="h3 mb-5">My Skills</h3>
        <ul className="content-card !pt-5 p-5">
          {resume.skills?.map((skill, index) => (
            <li 
              key={skill.id} 
              className={index !== resume.skills.length - 1 ? 'mb-4' : ''}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <h5 className="h5">{skill.name}</h5>
                <data value={skill.percentage} className="text-light-gray text-[13px] font-light">
                  {skill.percentage}%
                </data>
              </div>
              <div className="skill-progress-bg">
                <div 
                  className="skill-progress-fill" 
                  style={{ width: `${skill.percentage}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Download CV Button */}
      <section className="text-center">
        <a 
          href={profile?.cv_url || '#'} 
          download
          className="download-cv-btn inline-flex"
        >
          <Download className="w-5 h-5" />
          <span>Download CV</span>
        </a>
      </section>
    </article>
  );
};

export default ResumeSection;
