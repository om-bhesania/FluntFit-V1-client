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

function DashHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null); // Track the active menu item

  const menuItems = ["Add Products", "All Collections"];

  const handleItemClick = (index: any) => {
    setActiveIndex(index);
  };

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

      {/* Desktop Menu */}
      <NavbarContent className="hidden sm:!flex !items-center !justify-center nav-items !basis-0 !grow-0 !w-full">
        {menuItems.map((item, index) => (
          <NavbarItem
            key={`${item}-${index}`}
            isActive={activeIndex === index}
            className=""
          >
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

export { DashHeader };
