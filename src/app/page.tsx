import dynamic from 'next/dynamic';
import AboutPage from "../customcomponents/About";
import AboutEducation from "../customcomponents/AboutEducation";

const CursorTracker = dynamic(() => import("../customcomponents/Cursor"));
const DescriptionAbout = dynamic(() => import("../customcomponents/DescriptionAbout"));
const Experience = dynamic(() => import("../customcomponents/Experience"));
const OrbitingCirclesDemo = dynamic(() => import("../customcomponents/OrbitingCircleComponent"));
const ContactForm = dynamic(() => import("../customcomponents/ContactMe"));

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
