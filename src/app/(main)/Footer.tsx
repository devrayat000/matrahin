import { Facebook, Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import logo from "~/assets/logo.png";

export default function Footer() {
  return (
    <footer className="mt-4 py-3 bg-slate-50 border-t border-border">
      <section className="container flex flex-col sm:flex-row flex-nowrap justify-between items-center">
        <div className="flex justify-between sm:justify-end items-center gap-6">
          <Image src={logo} alt="Matrahin" width={44} height={44} />

          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} matrahin.com All rights reserved.
          </p>
        </div>
        <div className="flex justify-between sm:justify-end items-center">
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
