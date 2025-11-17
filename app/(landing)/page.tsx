import BgGradient from "@/components/common/bg-gradient";
import HeroSection from "@/components/landing/hero-section";
import Whytochoose from "@/components/landing/why-to-choose";
import AvailableIn from "@/components/landing/available-in";
import ExperiencesSection from "@/components/landing/experiences-section"; 

export default function Home() {
  return (
    <div className="relative w-full">
      <BgGradient>
        <div className="flex flex-col">
          <HeroSection />
          <Whytochoose />
          <AvailableIn/>
          <ExperiencesSection />
        </div>
      </BgGradient>
    </div>
  );
}