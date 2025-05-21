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

import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useUser();
  const navigate = useNavigate();

  console.log(user);

  const handleLogout = () => {
    logout();
    navigate("/login");
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
              <Button as={Link} href="/dashboard" variant="flat">
                Mes véhicules
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button onClick={handleLogout} variant="light">
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
                <Link href="/dashboard" size="lg">
                  Mes véhicules
                </Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <button onClick={handleLogout} className="text-left text-lg text-primary hover:underline">
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
