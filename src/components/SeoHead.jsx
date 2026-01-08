import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const SeoHead = ({ name, jobTitle, websiteUrl, imageUrl }) => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetch('/portfolio-hub-pro/src/api/mockData/profile.json') // Corrected path
      .then(response => response.json())
      .then(data => setProfileData(data))
      .catch(error => console.error('Error fetching profile data:', error));
  }, []);

  const finalName = name || (profileData ? profileData.name : 'Your Name Here');
  const finalJobTitle = jobTitle || (profileData ? profileData.title : 'Full Stack Web Developer');
  const finalDescription = profileData ? profileData.about : 'Default description if not fetched';

  return (
    <HelmetProvider>
      <Helmet>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{`${finalName} - ${finalJobTitle}`}</title>
        <meta name="description" content={finalDescription} />
        <meta name="keywords" content={`${finalName}, ${finalJobTitle}, portfolio, web development, UI/UX design, React, Laravel`} />
        <meta name="author" content={finalName} />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Protocol */}
        <meta property="og:title" content={`${finalName} - ${finalJobTitle}`} />
        <meta property="og:description" content={finalDescription} />
        <meta property="og:image" content={imageUrl || 'https://myportfolio.com/preview.jpg'} />
        <meta property="og:url" content={websiteUrl || 'https://myportfolio.com'} />
        <meta property="og:type" content="website" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${finalName} - ${finalJobTitle}`} />
        <meta name="twitter:description" content={finalDescription} />
        <meta name="twitter:image" content={imageUrl || 'https://myportfolio.com/preview.jpg'} />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "${finalName}",
          "jobTitle": "${finalJobTitle}",
          "url": "${websiteUrl || 'https://myportfolio.com'}",
          "image": "${imageUrl || 'https://myportfolio.com/preview.jpg'}",
          "description": "${finalDescription}"
        }
        </script>
      </Helmet>
    </HelmetProvider>
  );
};

export default SeoHead;
