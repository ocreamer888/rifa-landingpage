import RifaNumbers from "@/components/RifaNumbers";
import TripSection from "@/components/TripSection";
import DentalSection from "@/components/DentalSection";
import HomeHero from "@/components/HomeHero";

export default function HomePage() {
  return(
    <>
      <HomeHero />
      <TripSection />
      <DentalSection />
      <RifaNumbers />
    </>
  )
}