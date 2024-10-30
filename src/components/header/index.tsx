import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import { useState } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import { Login } from "../../pages/auth/login";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null); // Track the active menu item

  const menuItems = ["Men's Wear", "All Collections", "Dashboard"];

  const handleItemClick = (index: any) => {
    setActiveIndex(index);
  };

  const navigate = useNavigate();
  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="!flex !items-center !justify-center !w-full"
    >
      {/* Mobile menu toggle and brand */}
      <NavbarContent className="sm:hidden !basis-0 !grow-0">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      {/* Brand section */}
      <div className="">
        <NavbarContent className="sm:hidden pr-3 !basis-0 !grow-0">
          <NavbarBrand
            onClick={() => navigate("/")}
            className="font-bold text-xl cursor-pointer"
          >
            FlauntFit
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4 !basis-0 !grow-0">
          <NavbarBrand
            onClick={() => navigate("/")}
            className="font-bold text-xl cursor-pointer"
          >
            FlauntFit
          </NavbarBrand>
        </NavbarContent>
      </div>

      {/* Desktop Menu */}
      <NavbarContent className="hidden sm:!flex !items-center !justify-center nav-items !basis-0 !grow-0">
        {menuItems.map((item, index) => (
          <NavbarItem key={`${item}-${index}`} isActive={activeIndex === index}>
            <Link
              to={item.toLowerCase().split(" ").join("-")}
              onClick={() => handleItemClick(index)}
              className={`hover:text-primary ${
                activeIndex === index ? "text-primary" : "text-foreground"
              }`}
            >
              {item}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Login Button */}
      <NavbarContent className="!basis-0 !grow-0">
        <Login variant="solid" color="primary" />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              to={item.toLowerCase().split(" ").join("-")}
              onClick={() => handleItemClick(index)}
              color={activeIndex === index ? "primary" : "foreground"}
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

export { Header };
