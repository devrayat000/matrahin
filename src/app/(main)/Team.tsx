// import { Linkedin, Twitter } from "lucide-react";
// import { buttonVariants } from "~/components/ui/button";
import Image from "next/image";
import { use } from "react";
import {
  GetTeamMembersQuery,
  GetTeamMembersQueryVariables,
} from "~/generated/graphql";
import { gql, gqlClient } from "~/lib/utils";

const MEMBERS_QUERY = gql`
  query GetTeamMembers {
    members: teamMembers(orderBy: publishedAt_ASC) {
      id
      name
      designation
      image {
        src: url(
          transformation: {
            image: { resize: { fit: crop, width: 320, height: 384 } }
          }
        )
        height
        width
      }
    }
  }
`;

async function getMembers() {
  const { members } = await gqlClient.request<
    GetTeamMembersQuery,
    GetTeamMembersQueryVariables
  >(MEMBERS_QUERY, undefined, {
    next: { revalidate: 3600 },
  });
  return members;
}

export default function Team() {
  const members = use(getMembers());

  const imageSize = {
    width: 320,
    get height() {
      return (this.width / 5) * 6;
    },
  };

  return (
    <section id="team" className="container bg-white py-12 sm:py-16">
      <div className="mx-auto px-12 md:px-16">
        <div className="mx-auto lg:text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Team
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We’re a dynamic group of individuals who are passionate about what
            we do and dedicated to delivering the best results for our clients.
          </p>
        </div>
        <div className="mx-auto mt-16 sm:mt-20 lg:mt-24">
          <dl className="flex flex-wrap justify-center items-start gap-y-4 gap-x-8">
            {members.map((member, i) => (
              <div key={member.name} className="shrink-0">
                <Image
                  {...member.image}
                  alt={member.name}
                  aria-hidden="true"
                  {...imageSize}
                  className="rounded-lg"
                />
                <div className="mt-4">
                  <dt className="text-xl font-bold leading-7 text-gray-900">
                    {member.name}
                  </dt>
                  <dd>
                    <p
                      className="text-base leading-7 text-muted-foreground font-medium"
                      dangerouslySetInnerHTML={{
                        __html: member.designation.replace("\n", "<br/>"),
                      }}
                    />
                    <div className="flex gap-4 mt-2">
                      {/* <a
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
                      </a> */}
                    </div>
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
