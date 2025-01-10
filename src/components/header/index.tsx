import {
  ChevronDown,
  ChevronUp,
  LogOutIcon,
  Menu,
  PackageSearch,
  Plus,
  ReceiptTextIcon,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TopBar from "../topbar/Topbar";
import useToast from "../../hooks/useToast";
import { Logout } from "../../utils/utils";

const menuItems = [
  {
    name: "Products",
    path: "",
    icon: PackageSearch,
    dropdown: [
      {
        name: "All Products",
        path: "/products/all-products",
        icon: ShoppingCart,
      },
      { name: "Add Products", path: "/products/add-products", icon: Plus },
    ],
  },
  {
    name: "Customers",
    path: "/Customers",
    icon: User,
  },
  {
    name: "Invoice Generation",
    path: "/invoice/generate",
    icon: ReceiptTextIcon,
  },
];

interface LayoutProps {
  children: React.ReactNode;
  isLogin?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isLogin }) => {
  const location = useLocation();
  const nav = useNavigate();
  const { notify } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (menuName: string) => {
    setOpenDropdown((prev) => (prev === menuName ? null : menuName));
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-40 md:hidden p-2 rounded-md bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out md:flex md:h-screen w-64 flex-col bg-gray-900 z-30`}
      >
        {/* Title Section */}
        <div className="flex h-16 items-center justify-center border-b border-gray-800">
          <span className="text-xl font-bold text-white">MixBunch</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => (
            <div key={item.name}>
              <div
                key={item.name}
                className={`flex items-center px-4 py-2 text-sm cursor-pointer ${
                  location.pathname === item.path
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => {
                  if (!item.dropdown && item.path) {
                    // Navigate directly for items without dropdown
                    setIsMobileMenuOpen(false);
                  } else if (item.dropdown) {
                    // Toggle dropdown for items with dropdowns
                    toggleDropdown(item.name);
                  }
                }}
              >
                {/* Render Link for items with path and no dropdown */}
                {item.path && !item.dropdown ? (
                  <Link
                    to={item.path}
                    className="flex items-center w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                ) : (
                  <>
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                    {item.dropdown && (
                      <span className="ml-auto">
                        {openDropdown === item.name ? (
                          <ChevronUp className="h-4 w-4 text-white" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-white" />
                        )}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Dropdown */}
              {item?.dropdown && openDropdown === item.name && (
                <div className="pl-6 mb-2 space-y-1">
                  {item.dropdown.map((subItem) => (
                    <Link
                      key={subItem.name}
                      to={subItem.path}
                      className={`flex items-center px-4 p-2 text-xs ${
                        location.pathname === subItem.path
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <subItem.icon className="mr-2 h-4 w-4" />
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {isLogin ? (
          <div className="border-t border-gray-800 p-4">
            <button
              className="flex w-full items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
              onClick={() => Logout(nav, notify)}
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        ) : null}
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 overflow-y-auto transition-all duration-200 ease-in-out ${
          isMobileMenuOpen ? "md:ml-64" : ""
        }`}
      >
        <div className="">
          <TopBar />
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
