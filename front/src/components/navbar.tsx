import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { useNavigate } from "react-router-dom";

import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { useUser } from "@/contexts/UserContext";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
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

      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        {isAuthenticated && (
          <>
            <NavbarItem className="text-sm font-medium text-default-500">
              Bonjour {user?.firstname} {user?.lastname}
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} href="/vehicles" variant="flat">
                Mes véhicules
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button variant="light" onClick={handleLogout}>
                Déconnexion
              </Button>
            </NavbarItem>
          </>
        )}

        <ThemeSwitch />
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {isAuthenticated && (
            <>
              <NavbarMenuItem>
                <span className="text-default-600 text-sm font-semibold">
                  Bonjour, {user?.firstname || user?.email}
                </span>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link href="/vehicles" size="lg">
                  Mes véhicules
                </Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <button
                  className="text-left text-lg text-primary hover:underline"
                  onClick={handleLogout}
                >
                  Déconnexion
                </button>
              </NavbarMenuItem>
            </>
          )}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
