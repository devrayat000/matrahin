import Link from "next/link";
import Calculator2 from "~/assets/calc_2.svg";

export default function About() {
  return (
    <section id="about" className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex items-start gap-16">
        <Calculator2 className="max-w-xs lg:max-w-sm scale-150" />
        <div className="flex-1 text-center md:text-left">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-4xl lg:text-5xl">
            What's Matrahin?
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Welcome to Matrahin, your academic ally! Based in the vibrant city
            of Dhaka, Bangladesh, we are an edtech startup on a mission to
            simplify students' lives by offering a comprehensive suite of
            academic tools, all in one place. Our journey begins with
            cutting-edge physics simulations and advanced{" "}
            <Link href="/calc" className="underline">
              calculators
            </Link>{" "}
            designed to elevate your learning experience. As you explore the
            fascinating world of physics through our interactive simulations and
            effortlessly solve complex math problems with our powerful{" "}
            <Link href="/calc" className="underline">
              calculators
            </Link>
            , remember that this is just the beginning. Matrahin is committed to
            expanding its offerings, introducing more exciting tools and
            features to enhance your educational journey. Embark on this amazing
            adventure with us, and let Matrahin be your go-to destination for
            all your academic needs. You're cordially invited to join us as we
            revolutionize the way you learn and excel. Together, let's make
            education not just a process but an enjoyable and enriching
            experience.
          </p>
        </div>
      </div>
    </section>
  );
}
