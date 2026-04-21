import Hero from "@/sections/Hero";
import Categories from "@/sections/Categories";
import FeaturedProducts from "@/sections/FeaturedProducts";
import Promo from "@/sections/Promo";
import DealsSection from "@/sections/Deals";
import ReviewsSection from "@/sections/Reviews";
import DeliveryInfo from "@/sections/DeliveryInfo";
import About from "@/sections/About";
import CTA from "@/sections/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <DeliveryInfo />
      <Categories />
      <DealsSection />
      <FeaturedProducts />
      <Promo />
      <ReviewsSection />
      <About />
      <CTA />
    </>
  );
}
