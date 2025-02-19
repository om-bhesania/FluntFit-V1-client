import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Breadcrumbs: React.FC = () => {
  const location = useLocation();

  // Generate breadcrumb items dynamically from the path
  const pathSegments = location.pathname.split("/").filter(Boolean); // Remove empty strings

  return (
    <nav className="flex p-2" aria-label="Breadcrumb">
      <ol className="inline-flex items-center">
        {/* Always show "Home" as the first breadcrumb */}
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="text-sm font-semibold text-white hover:text-primary-dark"
          >
            Home
          </Link>
          {pathSegments.length > 0 && (
            <ChevronRight className="w-4 h-4 text-gray-400 mx-2 font-bold" />
          )}
        </li>

        {/* Add dynamic breadcrumbs */}
        {pathSegments.map((segment, index) => {
          const formattedSegment = segment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "); // Remove "-" only for display

          const linkPath = `/${pathSegments.slice(0, index + 1).join("/")}`; // Keep original for routing

          return (
            <li key={index} className="inline-flex items-center">
              {index === pathSegments.length - 1 ? (
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {formattedSegment}
                </span>
              ) : (
                <Link
                  to={linkPath}
                  className="text-sm font-semibold text-white hover:text-primary-dark"
                >
                  {formattedSegment}
                </Link>
              )}
              {index < pathSegments.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-2 font-bold" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
