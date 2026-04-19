import AboutPage from "../customcomponents/About";
import ContactForm from "../customcomponents/ContactMe";
import CursorTracker from "../customcomponents/Cursor";
import DescriptionAbout from "../customcomponents/DescriptionAbout";
import OrbitingCirclesDemo from "../customcomponents/OrbitingCircleComponent";


export default function Home() {
  return (
    <>
      <CursorTracker />
      <AboutPage />
      <DescriptionAbout />
      <OrbitingCirclesDemo />
      <ContactForm />
    </>
  );
}
