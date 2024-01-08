import { Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

const data = [
  {
    title: "About",
    links: [
      { label: "Features", link: "#" },
      { label: "Pricing", link: "#" },
      { label: "Support", link: "#" },
      { label: "Forums", link: "#" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "Contribute", link: "#" },
      { label: "Media assets", link: "#" },
      { label: "Changelog", link: "#" },
      { label: "Releases", link: "#" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Join Discord", link: "#" },
      { label: "Follow on Twitter", link: "#" },
      { label: "Email newsletter", link: "#" },
      { label: "GitHub discussions", link: "#" },
    ],
  },
];

export default function Footer() {
  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Link
        key={index}
        className="block py-0.5 text-xs text-muted-foreground hover:underline"
        href={link.link}
      >
        {link.label}
      </Link>
    ));

    return (
      <div className="w-40" key={group.title}>
        <h5 className="text-xl font-bold">{group.title}</h5>
        <div className="mt-2">{links}</div>
      </div>
    );
  });

  return (
    <footer className="mt-20 py-16 bg-slate-50 border-t border-border">
      <section className="container flex justify-between">
        <div className="max-w-48">
          <div>
            <span className="text-xl font-bold px-1 py-0.5 bg-foreground text-background rounded">
              Logo
            </span>
            <span className="text-xl font-semibold ml-1">Matrahin</span>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Build fully functional accessible web applications faster than ever
          </p>
        </div>
        <div className="flex flex-wrap">{groups}</div>
      </section>
      <section className="container flex justify-between items-center pt-7 mt-7 border-t border-border">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} matrahin.com All rights reserved.
        </p>

        <div className="flex justify-end items-center">
          <Button size="icon" variant="ghost">
            <Facebook className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost">
            <Youtube className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost">
            <Instagram className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </footer>
  );
}
