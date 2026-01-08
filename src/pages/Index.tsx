import PortfolioLayout from '../components/portfolio/PortfolioLayout';
import SeoHead from '../components/SeoHead';

const Index = () => {
  // You can pass dynamic props here if needed, e.g., from a context or API call
  return (
    <>
      <SeoHead
        name="Mohanad Ahmed Shehata"
        jobTitle="Full Stack Web Developer"
        websiteUrl="https://mohanadportfolio.vercel.app/" // Replace with your actual deployed domain
        imageUrl="https://mohanadportfolio.vercel.app/image.png" // Replace with your actual preview image URL
      />
      <PortfolioLayout />
    </>
  );
};

export default Index;
