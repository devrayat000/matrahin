import { Metadata } from "next";
import About from "./About";
import FAQ from "./FAQ";
import Features from "./Features";
import Hero from "./Hero";
import Stats from "./Stats";
import Team from "./Team";
import MathElements from "~/assets/math_elements.svg?url";

export const metadata: Metadata = {
  title: "Matrahin",
  description:
    "Immerse yourself in the world of physics with Matrahin's cutting-edge simulations. Our innovative platform offers a diverse range of interactive physics simulations, providing users with a hands-on and engaging learning experience. From projectile motion to river-boat math or 2D motion, Matrahin's simulations empower students to visualize and understand complex concepts in ways traditional teaching methods cannot match. Explore, experiment, and deepen your understanding of the physical world through our dynamic and immersive simulations.",
  openGraph: {
    type: "website",
    description:
      "Immerse yourself in the world of physics with Matrahin's cutting-edge simulations. Our innovative platform offers a diverse range of interactive physics simulations, providing users with a hands-on and engaging learning experience. From projectile motion to river-boat math or 2D motion, Matrahin's simulations empower students to visualize and understand complex concepts in ways traditional teaching methods cannot match. Explore, experiment, and deepen your understanding of the physical world through our dynamic and immersive simulations.",
    images: [
      {
        url: MathElements.src,
        alt: "Matrahin",
      },
    ],
    title: "Matrahin",
    url: new URL("https://matrahin.com"),
  },
  alternates: { canonical: new URL("https://matrahin.com") },
  category: "EdTech",
  metadataBase: new URL("https://matrahin.com"),
};

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
