import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

const SeoHead = ({ name, jobTitle, websiteUrl, imageUrl }) => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetch('/api/mockData/profile.json') // لازم الملف يبقى في public/api/mockData
      .then((res) => res.json())
      .then((data) => setProfileData(data))
      .catch((err) => console.error('Error fetching profile data:', err));
  }, []);

  const finalName = name || profileData?.name || 'Your Name Here';
  const finalJobTitle =
    jobTitle || profileData?.title || 'Full Stack Web Developer';
  const finalDescription =
    profileData?.about || 'Professional portfolio website';

  const finalWebsiteUrl =
    websiteUrl || 'https://mohanadportfolio.vercel.app/';
  const finalImageUrl =
    imageUrl || 'https://mohanadportfolio.vercel.app/image.png';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: finalName,
    jobTitle: finalJobTitle,
    url: finalWebsiteUrl,
    image: finalImageUrl,
    description: finalDescription,
  };

  return (
    <Helmet>
      {/* Basic Meta */}
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{`${finalName} - ${finalJobTitle}`}</title>
      <meta name="description" content={finalDescription} />
      <meta
        name="keywords"
        content={`${finalName}, ${finalJobTitle}, portfolio, React, Laravel, Web Developer`}
      />
      <meta name="author" content={finalName} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:title" content={`${finalName} - ${finalJobTitle}`} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImageUrl} />
      <meta property="og:url" content={finalWebsiteUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${finalName} - ${finalJobTitle}`} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImageUrl} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </Helmet>
  );
};

export default SeoHead;
