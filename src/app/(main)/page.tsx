import About from "./About";
import FAQ from "./FAQ";
import Features from "./Features";
import Hero from "./Hero";
import Stats from "./Stats";
import Team from "./Team";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <About />
      {/* <Stats /> */}
      <Features />
      <Team />
      <FAQ />
    </div>
  );
}
