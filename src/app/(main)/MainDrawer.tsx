import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { buttonVariants } from "~/components/ui/button";
import { auth } from "~/lib/auth";
import { use } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getAvatarLetters, getLastName } from "~/lib/utils/name";
import { MenuIcon } from "lucide-react";
import MainNav from "./MainNav";
import Link from "next/link";
import LogOutButton from "~/components/common/LogoutButton";
import { Separator } from "~/components/ui/separator";

export default function MainDrawer() {
  const session = use(auth());

  return (
    <Drawer>
      <DrawerTrigger className="sm:hidden">
        {!session ? (
          <MenuIcon className="w-6 h-6" />
        ) : (
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={session.user.image}
              alt={`@${getAvatarLetters(session.user.name)}`}
            />
            <AvatarFallback>
              {getAvatarLetters(session.user.name)}
            </AvatarFallback>
          </Avatar>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          {!session ? (
            <Link
              href="/login"
              className={buttonVariants({ variant: "outline" })}
            >
              Login
            </Link>
          ) : (
            <>
              <DrawerTitle>{getLastName(session.user.name)}</DrawerTitle>
              <DrawerDescription>{session.user.email}</DrawerDescription>
            </>
          )}
        </DrawerHeader>
        <DrawerFooter>
          <div className="flex flex-col gap-y-2 items-stretch">
            <MainNav />
            {!!session && (
              <>
                <Separator />
                <div className="flex flex-col gap-y-1 items-stretch">
                  <Link
                    href="/profile"
                    className={buttonVariants({ variant: "ghost" })}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/profile/subscription"
                    className={buttonVariants({ variant: "ghost" })}
                  >
                    Subscription
                  </Link>
                  <LogOutButton>Logout</LogOutButton>
                </div>
              </>
            )}
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
