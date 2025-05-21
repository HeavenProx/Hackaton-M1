import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";

import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon } from "@/components/icons";
import { Logo } from "@/components/icons";

export const Navbar = () => {
  const isLoggedIn = false; // à remplacer par le système d'auth

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      {/* Gauche : Logo + Nom app */}
      <NavbarContent justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <Logo />
            <p className="font-bold text-inherit text-xl">Garage Folie</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Droite : Boutons selon l'état connecté ou pas */}
      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        {!isLoggedIn ? (
          <></>
        ) : (
          <>
            <NavbarItem>
              <Button as={Link} href="/dashboard" variant="flat">
                Mon compte
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} href="/logout" variant="light">
                Se déconnecter
              </Button>
            </NavbarItem>
          </>
        )}
        <ThemeSwitch />
      </NavbarContent>

      {/* Menu mobile */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {!isLoggedIn ? (
            <></>
          ) : (
            <>
              <NavbarMenuItem>
                <Link href="/dashboard" size="lg">
                  Mon compte
                </Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link href="/logout" size="lg">
                  Se déconnecter
                </Link>
              </NavbarMenuItem>
            </>
          )}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
