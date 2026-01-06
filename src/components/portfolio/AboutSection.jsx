import { useProfile, useServices, useTestimonials, useClients } from '../../context/DataContext';
import { useState } from 'react';
import { Palette, Code, Smartphone, Camera, X, Quote } from 'lucide-react';

const serviceIcons = {
  design: Palette,
  dev: Code,
  app: Smartphone,
  photo: Camera,
};

const AboutSection = () => {
  const profile = useProfile();
  const services = useServices();
  const testimonials = useTestimonials();
  const clients = useClients();
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  if (!profile) return null;

  return (
    <article className="animate-fade-in">
      {/* Title */}
      <header>
        <h2 className="h2 article-title">About me</h2>
      </header>

      {/* About Text */}
      <section className="text-light-gray text-sm font-light leading-relaxed mb-8">
        {profile.about?.map((paragraph, index) => (
          <p key={index} className="mb-4">{paragraph}</p>
        ))}
      </section>

      {/* Services */}
      <section className="mb-9">
        <h3 className="h3 mb-5">What I'm Doing</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services?.services?.map((service) => {
            const Icon = serviceIcons[service.icon] || Code;
            return (
              <li key={service.id} className="service-item">
                <div className="w-10 h-10 flex items-center justify-center text-primary flex-shrink-0">
                  <Icon className="w-10 h-10" />
                </div>
                <div className="text-left">
                  <h4 className="h4 mb-2">{service.title}</h4>
                  <p className="text-light-gray text-sm font-light leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Testimonials */}
      <section className="mb-8">
        <h3 className="h3 mb-5">Testimonials</h3>
        <ul className="flex gap-4 overflow-x-auto has-scrollbar pb-8 -mx-4 px-4 md:-mx-[30px] md:px-[30px]">
          {testimonials?.testimonials?.map((testimonial) => (
            <li 
              key={testimonial.id} 
              className="min-w-[300px] md:min-w-[350px] flex-shrink-0"
            >
              <div 
                className="content-card cursor-pointer hover:shadow-portfolio-3 transition-shadow"
                onClick={() => setSelectedTestimonial(testimonial)}
              >
                {/* Avatar */}
                <figure 
                  className="absolute top-0 left-0 -translate-y-6 translate-x-4 md:-translate-y-[30px] md:translate-x-[30px] rounded-[14px] md:rounded-[20px] shadow-portfolio-1 overflow-hidden"
                  style={{ background: 'var(--bg-gradient-onyx)' }}
                >
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-[60px] h-[60px] md:w-20 md:h-20 object-cover"
                  />
                </figure>

                <h4 className="h4 mb-2 ml-[95px] md:ml-[95px]">{testimonial.name}</h4>
                <p className="text-light-gray text-sm font-light leading-relaxed line-clamp-4">
                  {testimonial.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Testimonial Modal */}
      {selectedTestimonial && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4"
          onClick={() => setSelectedTestimonial(null)}
        >
          <div 
            className="bg-card border border-border rounded-[14px] md:rounded-[20px] p-4 md:p-[30px] max-w-lg w-full shadow-portfolio-5 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedTestimonial(null)}
              className="absolute top-4 right-4 bg-onyx rounded-lg w-8 h-8 flex items-center justify-center text-white-2 hover:opacity-80 transition-opacity"
            >
              <X className="w-[18px] h-[18px]" />
            </button>

            {/* Content */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar & Quote */}
              <div className="flex flex-col items-center">
                <figure 
                  className="rounded-[18px] shadow-portfolio-2 mb-4 overflow-hidden"
                  style={{ background: 'var(--bg-gradient-onyx)' }}
                >
                  <img 
                    src={selectedTestimonial.avatar} 
                    alt={selectedTestimonial.name}
                    className="w-[65px] h-[65px] object-cover"
                  />
                </figure>
                <Quote className="w-[35px] h-auto text-primary hidden md:block" />
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <h4 className="h3 mb-1">{selectedTestimonial.name}</h4>
                <time className="text-sm text-light-gray/70 font-light mb-4 block">
                  {new Date(selectedTestimonial.date).toLocaleDateString('en-US', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </time>
                <p className="text-light-gray text-sm font-light leading-relaxed">
                  {selectedTestimonial.text}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clients */}
      <section className="mb-4">
        <h3 className="h3 mb-5">Clients</h3>
        <ul className="flex gap-4 md:gap-[50px] overflow-x-auto has-scrollbar pb-6 -mx-4 px-4 md:-mx-[30px] md:px-[30px]">
          {clients?.clients?.map((client) => (
            <li 
              key={client.id} 
              className="min-w-[calc(33.33%-10px)] md:min-w-[calc(25%-35px)] flex-shrink-0"
            >
              <a href={client.url} className="block">
                <img 
                  src={client.logo} 
                  alt={client.name}
                  className="w-full grayscale hover:grayscale-0 transition-all duration-300"
                />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};

export default AboutSection;
