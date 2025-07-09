import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

type NavItems = {
  to: string;
  label: string;
};
const pages: NavItems[] = [
  { to: "/", label: "Home" },
  { to: "/favorites", label: "Your favorites" },
];

export const Header = () => (
  <header className="bg-white shadow-sm sticky top-0 z-50">
    <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
      <NavLink to="/">
        <h1 className="text-xl font-bold text-blue-600">Pokémon Explorer</h1>
      </NavLink>
      <NavigationMenu>
        <NavigationMenuList className="space-x-4">
          {pages.map(({ to, label }) => (
            <NavigationMenuItem key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  clsx(
                    "text-sm font-medium hover:text-blue-600 transition",
                    isActive ? "text-blue-600 underline" : "text-gray-700"
                  )
                }
              >
                {label}
              </NavLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  </header>
);
