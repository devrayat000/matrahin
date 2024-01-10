import { Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import rain from "~/assets/cards/rain.jpg";
import { buttonVariants } from "~/components/ui/button";

const members = [
  {
    name: "John Doe",
    designation: "CEO",
    image: rain,
    linkedin: "https://www.linkedin.com/",
    twitter: "https://twitter.com/",
  },
  {
    name: "John Doe",
    designation: "CEO",
    image: rain,
    linkedin: "https://www.linkedin.com/",
    twitter: "https://twitter.com/",
  },
  {
    name: "John Doe",
    designation: "CEO",
    image: rain,
    linkedin: "https://www.linkedin.com/",
    twitter: "https://twitter.com/",
  },
  {
    name: "John Doe",
    designation: "CEO",
    image: rain,
    linkedin: "https://www.linkedin.com/",
    twitter: "https://twitter.com/",
  },
];

export default function Team() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Team
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We’re a dynamic group of individuals who are passionate about what
            we do and dedicated to delivering the best results for our clients.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid grid-cols-4 gap-x-8">
            {members.map((member, i) => (
              <div key={member.name} className="">
                <Image
                  {...member.image}
                  alt={member.name}
                  aria-hidden="true"
                  width={420}
                  className="aspect-[5_/_6] rounded-lg"
                />
                <div className="mt-4">
                  <dt className="text-xl font-bold leading-7 text-gray-900">
                    {member.name}
                  </dt>
                  <dd>
                    <p className="text-base leading-7 text-muted-foreground font-medium">
                      {member.designation}
                    </p>
                    <div className="flex gap-4 mt-2">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                      >
                        <Linkedin className="w-5 h-5 fill-slate-400 group-hover:fill-slate-500 transition-colors stroke-none" />
                      </a>
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                      >
                        <Twitter className="w-5 h-5 fill-slate-400 group-hover:fill-slate-500 transition-colors stroke-none" />
                      </a>
                    </div>
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
