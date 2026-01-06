import { useState } from 'react';
import { useProfile } from '../../context/DataContext';
import { Send } from 'lucide-react';

const ContactSection = () => {
  const profile = useProfile();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    
    // Check form validity
    const { fullname, email, message } = newFormData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(fullname.trim() !== '' && emailRegex.test(email) && message.trim() !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Form submitted:', formData);
    
    // Reset form
    setFormData({ fullname: '', email: '', message: '' });
    setIsValid(false);
    setIsSubmitting(false);
    
    alert('Message sent successfully!');
  };

  return (
    <article className="animate-fade-in">
      {/* Title */}
      <header>
        <h2 className="h2 article-title">Contact</h2>
      </header>

      {/* Map */}
      <section className="relative h-[250px] w-full rounded-2xl mb-8 border border-border overflow-hidden">
        <figure className="h-full">
          <iframe
            src={profile?.map_embed}
            width="100%"
            height="100%"
            loading="lazy"
            className="border-none grayscale invert"
            title="Location Map"
          />
        </figure>
      </section>

      {/* Contact Form */}
      <section className="mb-[10px]">
        <h3 className="h3 mb-5">Contact Form</h3>

        <form onSubmit={handleSubmit}>
          {/* Input Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[25px] mb-[25px]">
            <input 
              type="text" 
              name="fullname" 
              className="form-input" 
              placeholder="Full name" 
              required
              value={formData.fullname}
              onChange={handleChange}
            />
            <input 
              type="email" 
              name="email" 
              className="form-input" 
              placeholder="Email address" 
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Message */}
          <textarea 
            name="message" 
            className="form-input min-h-[100px] h-[120px] max-h-[200px] resize-y mb-[25px]" 
            placeholder="Your Message" 
            required
            value={formData.message}
            onChange={handleChange}
          />

          {/* Submit Button */}
          <button 
            type="submit" 
            className="form-btn"
            disabled={!isValid || isSubmitting}
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
          </button>
        </form>
      </section>
    </article>
  );
};

export default ContactSection;
