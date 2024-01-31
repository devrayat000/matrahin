import { MoveRight } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import LogOutButton from "~/components/common/LogoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { auth } from "~/lib/auth";
import { findStudent } from "~/services/graphql/user";
import { cn } from "~/lib/utils";
import { getAvatarLetters, getLastName } from "~/lib/utils/name";

export default function UserNav() {
  const session = use(auth());

  if (!session)
    return (
      <Link
        href="/login"
        className={cn(buttonVariants({ variant: "ghost" }), "flex gap-2")}
      >
        Login
        <MoveRight className="w-4 h-4" />
      </Link>
    );

  const { name, email } = session.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={session.user.image}
              alt={`@${getAvatarLetters(name)}`}
            />
            <AvatarFallback>{getAvatarLetters(name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-y-1">
            <p className="text-sm font-medium leading-none">
              {getLastName(name)}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile/subscription">
              Subscription
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem asChild> */}
        <LogOutButton className="w-full" size="sm">
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </LogOutButton>
        {/* </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
