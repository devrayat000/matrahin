import Link from "next/link";
import { use } from "react";
import LogOutButton from "~/components/common/LogoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
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
import { auth, findStudent } from "~/lib/auth";

function getAvatarLetters(fullName: string): string {
  const words = fullName.split(" ");

  if (words.length === 1) {
    // For a single word, take the first two characters
    return words[0].substring(0, 2).toUpperCase();
  } else {
    // For multiple words, take the first character of the first name and the first character of the last name
    const firstName = words[0].charAt(0);
    const lastName = words[words.length - 1].charAt(0);

    return (firstName + lastName).toUpperCase();
  }
}

function getLastName(fullName: string) {
  const words = fullName.split(" ");
  return words[words.length - 1];
}

export default function UserNav() {
  const session = use(auth());
  const { name, email } = use(findStudent(session.user.email));

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
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
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
