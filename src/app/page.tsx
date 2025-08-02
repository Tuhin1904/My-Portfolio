import AboutPage from "./components/About";
import ContactForm from "./components/ContactMe";
import DescriptionAbout from "./components/DescriptionAbout";
import OrbitingCirclesDemo from "./components/OrbitingCircleComponent";


export default function Home() {
  return (
    <>
      <AboutPage />
      <DescriptionAbout />
      <OrbitingCirclesDemo />
      <ContactForm />
    </>
  );
}
