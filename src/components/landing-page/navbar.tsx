"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS } from "@/lib/constant";
import { authClient } from "@/server/better-auth/client";
import type { Session } from "@/server/better-auth/config";
import {
  IconLogout,
  IconMenu,
  IconMoon,
  IconSun,
  IconUser,
} from "@tabler/icons-react";
import type { Route } from "next";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Logo from "../shared/logo";

type NavbarProps = {
  session: Session | null;
};

export function Navbar({ session }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
          toast.success("Signed out successfully");
        },
      },
    });
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Logo />
          <span className="text-xl font-bold">CERO</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          {NAV_LINKS.map((link) =>
            link.external ? (
              <Link
                key={link.href}
                href={link.href as Route}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.href}
                href={link.href as any}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            )
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="ml-2"
          >
            <IconSun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <IconMoon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {session.user.image && session.user.image.length > 1 ? (
                  <div className="relative aspect-square h-8 w-8 rounded-full overflow-hidden">
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User Avatar"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <Button variant="outline" size="icon" className="ml-2">
                    <IconUser className="h-8 w-8" />

                    <span className="sr-only">User menu</span>
                  </Button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="flex flex-col space-y-1">
                  <span className="text-sm font-medium">
                    {session.user.name || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {session.user.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <IconLogout className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90">
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <IconSun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <IconMoon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <IconMenu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[400px] p-0">
              <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
              <div className="flex flex-col h-full">
                {/* Header with logo */}
                <div className="border-b px-6 py-4">
                  <Link
                    href="/"
                    className="flex items-center space-x-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="relative h-6 w-6">
                      <svg
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-full w-full"
                      >
                        <path
                          d="M30 10 L30 25 L25 28 L10 28 L10 25 L10 15 L15 12 L20 12 L20 15 L15 15 L15 23 L25 23 L25 13 L20 13 L20 10 Z"
                          fill="#FF6B6B"
                        />
                        <path d="M30 10 L35 7 L35 22 L30 25 Z" fill="#374151" />
                        <path
                          d="M15 12 L20 9 L35 9 L30 10 L20 10 Z"
                          fill="#FF8888"
                        />
                      </svg>
                    </div>
                    <span className="text-lg font-bold">cero</span>
                  </Link>
                </div>

                {/* Navigation links */}
                <nav className="flex-1 px-4 py-6">
                  <div className="flex flex-col space-y-1">
                    {NAV_LINKS.map((link) =>
                      link.external ? (
                        <Link
                          key={link.href}
                          href={link.href as Route}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsOpen(false)}
                          className="px-4 py-3 rounded-lg text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-[#FF6B6B]"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <Link
                          key={link.href}
                          href={link.href as any}
                          onClick={() => setIsOpen(false)}
                          className="px-4 py-3 rounded-lg text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-[#FF6B6B]"
                        >
                          {link.label}
                        </Link>
                      )
                    )}
                  </div>
                </nav>

                {/* Footer with CTA */}
                <div className="border-t px-4 py-4 space-y-3">
                  {session?.user ? (
                    <>
                      <div className="px-2 py-2 text-sm">
                        <p className="font-medium">
                          {session.user.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                      <Button
                        onClick={handleSignOut}
                        className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 w-full text-base font-medium h-10"
                      >
                        <IconLogout className="mr-2 h-5 w-5" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button
                      asChild
                      className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 w-full text-base font-medium h-10"
                    >
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
