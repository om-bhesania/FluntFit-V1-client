import {
  ChevronLeft,
  ChevronRight,
  Menu,
  PackageSearch,
  Plus,
  ReceiptTextIcon,
  Users,
  X
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import usePermissions from "../../hooks/usePermissions";
import useToast from "../../hooks/useToast";
import TopBar from "../topbar/Topbar";

const menuItems = [
  {
    name: "Product Management",
    path: "/products",
    icon: PackageSearch,
    module: "products",
    dropdown: [
      {
        name: "Add Products",
        path: "/products/add-products",
        icon: Plus,
        module: "products",
      },
    ],
  },
  {
    name: "Employee Management",
    path: "/employee-management/listing",
    icon: Users,
    module: "employees",
    dropdown: [
      {
        name: "Add Employee",
        path: "/employee-management",
        icon: Plus,
        module: "employees",
      },
    ],
  },
  {
    name: "Invoice Management",
    path: "/invoice",
    icon: ReceiptTextIcon,
    module: "invoices",
    dropdown: [
      {
        name: "Add Invoice",
        path: "/invoice/generate",
        icon: Plus,
        module: "invoices",
      },
    ],
  },
];

const Layout = ({ children }: any) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { notify } = useToast();
  const { hasPermission } = usePermissions(notify);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMenuItemClick = (path: any) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const filteredMenuItems = menuItems.filter((item) =>
    hasPermission(item.module, "read")
  ); 
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-950">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-10 left-4 z-40 md:hidden p-2 rounded-md bg-gray-950 text-gray-400 hover:text-white hover:bg-gray-700"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-all duration-200 ease-in-out md:flex md:h-screen ${
          isCollapsed && !isHovered ? "w-16" : "w-64"
        } flex-col bg-gray-950 z-30 border-r border-gray-800`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
          {(!isCollapsed || isHovered) && (
            <span className="text-xl font-bold text-white">MixBunch</span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-2 text-gray-400 hover:text-white"
          >
            {isCollapsed && !isHovered ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {filteredMenuItems.map((item) => (
            <div key={item.name}>
              <div
                className={`flex items-center px-4 py-2 text-sm cursor-pointer ${
                  location.pathname === item.path
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => handleMenuItemClick(item.path)}
              >
                <item.icon className="h-5 w-5" />
                {(!isCollapsed || isHovered) && (
                  <span className="ml-3">{item.name}</span>
                )}
              </div>

              {/* Dropdown */}
              {(!isCollapsed || isHovered) && item.dropdown && (
                <div className="pl-6 mb-2 space-y-1">
                  {item.dropdown
                    .filter((subItem) =>
                      hasPermission(subItem.module, "read")
                    )
                    .map((subItem) => (
                      <div
                        key={subItem.name}
                        className={`flex items-center px-4 py-2 text-xs cursor-pointer ${
                          location.pathname === subItem.path
                            ? "bg-gray-800 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }`}
                        onClick={() => handleMenuItemClick(subItem.path)}
                      >
                        <subItem.icon className="mr-2 h-4 w-4" />
                        {subItem.name}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-950">
        <TopBar />
        {children}
      </div>
    </div>
  );
};

export default Layout;

