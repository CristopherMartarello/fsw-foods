"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import {
  HeartIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  ScrollTextIcon,
} from "lucide-react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";

const Header = () => {
  const { data } = useSession();

  const handleSignOutClick = () => signOut();
  const handleSignInClick = () => signIn();

  return (
    <div className="flex justify-between px-5 pt-6">
      <div className="relative h-[30px] w-[100px]">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="FSW Foods"
            fill
            className="object-cover"
          />
        </Link>
      </div>

      <Sheet>
        <SheetTrigger>
          <Button
            size="icon"
            variant="outline"
            className="border-none bg-transparent"
          >
            <MenuIcon />
          </Button>
        </SheetTrigger>

        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-left">Menu</SheetTitle>
          </SheetHeader>

          {data?.user ? (
            <>
              <div className="flex justify-between pt-6">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={data?.user?.image as string | undefined}
                    />
                    <AvatarFallback>
                      {data?.user?.name?.split(" ")[0][0]}
                      {/* {data?.user?.name?.split(" ")[1][0]} */}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="font-semibold">{data?.user?.name}</h3>
                    <span className="block text-xs text-muted-foreground">
                      {data?.user?.email}
                    </span>
                  </div>
                </div>

                <Button size="icon" onClick={handleSignOutClick}>
                  <LogOutIcon size={20} />
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between pt-10">
                <h2 className="font-semibold">Olá! Faça seu Login.</h2>
                <Button size="icon" onClick={handleSignInClick}>
                  <LogInIcon />
                </Button>
              </div>
            </>
          )}

          <div className="py-6 ">
            <Separator className="h-[0.5px] bg-[#EEEEEE]" />
          </div>

          <div className="space-y-2">
            <Button
              variant={"ghost"}
              className="w-full justify-start gap-3 text-sm font-normal"
            >
              <HomeIcon size={16} />
              <span className="block">Início</span>
            </Button>

            <Button
              variant={"ghost"}
              className="w-full justify-start gap-3 text-sm font-normal"
            >
              <ScrollTextIcon size={16} />
              <span className="block">Meus Pedidos</span>
            </Button>

            <Button
              variant={"ghost"}
              className="w-full justify-start gap-3 text-sm font-normal"
            >
              <HeartIcon size={16} />
              <span className="block">Restaurantes favoritos</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Header;
