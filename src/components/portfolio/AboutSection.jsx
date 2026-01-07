import { useProfile, useServices, useTestimonials, useClients } from '../../context/DataContext';
import { useState } from 'react';
import { createPortal } from 'react-dom';
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

  const defaultText = "Richard was hired to create a corporate identity. We were very pleased with the work done. She has a lot of experience and is very concerned about the needs of client.";

  if (!profile) return null;

  return (
    <article className="animate-fade-in">
      <header>
        <h2 className="h2 article-title">About me</h2>
      </header>

      <section className="text-light-gray text-[18px] font-light leading-relaxed mb-9 text-left ">
        {profile.about?.map((paragraph, index) => (
          <p key={index} className="mb-4 text-left ">{paragraph}</p>
        ))}
      </section>

      {/* Services */}
      <section className="mb-9">
        <h3 className="h3 mb-5">What I'm Doing</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services?.services?.map((service) => {
            const Icon = serviceIcons[service.icon] || Code;
            return (
              <li key={service.id} className="service-item p-[20px] md:p-[30px] bg-border-gradient-onyx rounded-[14px] shadow-portfolio-2 flex gap-5 items-start z-10 relative">
                <div className="absolute inset-[1px] bg-bg-gradient-jet rounded-[14px] -z-10" />
                <div className="text-primary w-[40px] h-[40px] flex-shrink-0">
                  <Icon className="w-10 h-10" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <h4 className="h4 mb-2 text-white-2">{service.title}</h4>
                  <p className="text-light-gray text-[15px] font-light leading-relaxed text-left">
                    {service.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Testimonials Section */}
      <section className="mb-8">
        <h3 className="h3 mb-5">Testimonials</h3>
        
        <div className="-mx-[15px] md:-mx-[30px] px-[15px] md:px-[30px]">
          <ul className="flex items-stretch gap-[15px] md:gap-[30px] overflow-x-auto pt-[30px] pb-[35px] has-scrollbar scroll-smooth snap-x snap-mandatory">
            {testimonials?.testimonials?.map((testimonial) => (
              <li 
                key={testimonial.id} 
                className="w-full md:w-[calc(50%-15px)] flex-shrink-0 snap-center"
              >
                <div 
                  className="content-card relative bg-border-gradient-onyx p-[20px] pt-[45px] md:p-[30px] md:pt-[25px] rounded-[14px] shadow-portfolio-2 cursor-pointer h-full z-10 group mt-0"
                  onClick={() => setSelectedTestimonial(testimonial)}
                >
                  <div className="absolute inset-[1px] bg-bg-gradient-jet rounded-[14px] -z-10" />
                  
                  {/* Avatar */}
                  <figure className="absolute top-0 left-0 bg-gradient-onyx rounded-[14px] shadow-portfolio-1 overflow-hidden -translate-y-[30px] translate-x-[20px] md:translate-x-[30px] w-[60px] h-[60px] md:w-[80px] md:h-[80px]">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                  </figure>
                  
                  {/* Text Content */}
                  {/* الحل هنا: أزلنا المارجن من الـ div الأب */}
                  <div className="min-w-0 text-left ">
                     
                     {/* وأضفنا المارجن للاسم فقط ليبتعد عن الصورة */}
                     <h3 className="h3 mb-3 text-white-2 truncate text-left md:ml-[95px] ml-[80px]">
                        {testimonial.name}
                     </h3>
                     
                     {/* النص الآن بدون مارجن وسيبدأ من بداية السطر تحت الصورة */}
                     <div className="text-light-gray text-[15px] font-light leading-relaxed line-clamp-4">
                       <p className="break-words text-left">
                         {(testimonial.text && testimonial.text.length > 5) ? testimonial.text : defaultText}
                       </p>
                     </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ==========================================================
          MODAL
          ========================================================== */}
      {selectedTestimonial && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-[3px] animate-fade-in"
            onClick={() => setSelectedTestimonial(null)}
          ></div>

          <div className="relative bg-eerie-black-2 border border-jet rounded-[24px] shadow-portfolio-5 w-full max-w-[850px] p-[40px] animate-scale-up z-10">
            
            <button 
              onClick={() => setSelectedTestimonial(null)}
              className="absolute top-5 right-5 bg-onyx hover:bg-jet text-white-2 rounded-[12px] w-12 h-12 flex items-center justify-center transition-all duration-200 shadow-lg z-50 group border border-jet/50"
            >
              <X className="w-6 h-6 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
            </button>

            <div className="flex flex-col md:flex-row gap-8 relative z-10">
              <div className="flex-shrink-0 flex flex-col items-center md:items-start pt-2">
                <div className="w-[100px] h-[100px] bg-gradient-onyx rounded-[20px] p-[5px] shadow-portfolio-2 mb-5">
                  <img 
                    src={selectedTestimonial.avatar} 
                    alt={selectedTestimonial.name}
                    className="w-full h-full object-cover rounded-[14px]"
                  />
                </div>
                <div className="flex justify-center w-[100px]">
                    <Quote className="w-10 h-10 text-orange-yellow-crayola opacity-80" fill="currentColor" stroke="none" />
                </div>
              </div>

              <div className="flex-1 pt-1 min-w-0 text-left">
                <h3 className="text-[28px] md:text-[32px] text-white-2 font-bold mb-2 tracking-tight break-words text-left">
                  {selectedTestimonial.name}
                </h3>
                
                <time className="block text-[16px] text-light-gray/70 mb-6 font-medium text-left">
                  {new Date(selectedTestimonial.date).toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </time>

                <div className="text-[16px] md:text-[18px] text-light-gray font-light leading-loose max-h-[400px] overflow-y-auto pr-3 custom-scrollbar">
                   <p className="break-words text-left">
                      {(selectedTestimonial.text && selectedTestimonial.text.length > 5) ? selectedTestimonial.text : defaultText}
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Clients */}
      <section className="mb-4">
        <h3 className="h3 mb-5">Clients</h3>
        <div className="-mx-[15px] px-[15px]">
            <ul className="flex gap-[30px] overflow-x-auto has-scrollbar pb-6 scroll-smooth snap-x">
            {clients?.clients?.map((client) => (
                <li key={client.id} className="min-w-[50%] md:min-w-[calc(33.33%-20px)] lg:min-w-[calc(25%-30px)] flex-shrink-0 snap-start">
                <a href={client.url} className="block group">
                    <img 
                    src={client.logo} 
                    alt={client.name}
                    className="w-full grayscale group-hover:grayscale-0 transition-all duration-300 opacity-60 group-hover:opacity-100"
                    />
                </a>
                </li>
            ))}
            </ul>
        </div>
      </section>
    </article>
  );
};

export default AboutSection;