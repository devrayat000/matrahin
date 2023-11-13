import { Link } from "react-router-dom";
import projectile from "~/assets/cards/projectile.png";

export default function HomePage() {
  return (
    <main>
      <section className="mt-6 mx-20 p-3">
        <h1 className="text-center text-3xl font-bold">Physics Calculator</h1>

        <div className="mt-10 grid grid-cols-3">
          <Link to="projectile">
            <figure>
              <img
                src={projectile}
                alt="projectile"
                className="aspect-video object-fill rounded-md shadow-md hover:shadow-lg transition ease-in-out"
              />
              <figcaption className="text-xl font-semibold text-center mt-2">
                Projectile
              </figcaption>
            </figure>
          </Link>
        </div>
      </section>
    </main>
  );
}
