import AboutPage from "./components/About";
import ContactForm from "./components/ContactMe";
import CursorTracker from "./components/Cursor";
import DescriptionAbout from "./components/DescriptionAbout";
import OrbitingCirclesDemo from "./components/OrbitingCircleComponent";


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
