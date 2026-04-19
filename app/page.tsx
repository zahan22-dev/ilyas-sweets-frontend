import Hero from "@/sections/Hero";
import Categories from "@/sections/Categories";
import FeaturedProducts from "@/sections/FeaturedProducts";
import Promo from "@/sections/Promo";
import About from "@/sections/About";
import CTA from "@/sections/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Promo />
      <About />
      <CTA />
    </>
  );
}
