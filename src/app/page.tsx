import dynamic from 'next/dynamic';
import AboutPage from "@/components/portfolio/About";
import AboutEducation from "@/components/portfolio/AboutEducation";

const CursorTracker = dynamic(() => import("@/components/common/Cursor"));
const DescriptionAbout = dynamic(() => import("@/components/portfolio/DescriptionAbout"));
const Experience = dynamic(() => import("@/components/portfolio/Experience"));
const OrbitingCirclesDemo = dynamic(() => import("@/components/portfolio/OrbitingCircleComponent"));
const ContactForm = dynamic(() => import("@/components/portfolio/ContactMe"));

export default function Home() {
  return (
    <>
      <CursorTracker />
      {/* Hero — who is Tuhin */}
      <AboutPage />
      {/* Bio, years of experience & project stats */}
      <DescriptionAbout />
      {/* Education background */}
      <AboutEducation />
      {/* Work experience timeline */}
      <Experience />
      {/* Tech-stack skills orbit */}
      <OrbitingCirclesDemo />
      {/* Contact CTA */}
      <ContactForm />
    </>
  );
}
