import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Breadcrumbs: React.FC = () => {
  const location = useLocation();

  // Generate breadcrumb items dynamically from the path
  const items = location.pathname
    .split("/")
    .filter(Boolean) // Remove empty strings caused by leading/trailing slashes
    .map((segment) =>
      segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center">
        {/* Always show "Home" as the first breadcrumb */}
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-dark p-2"
          >
            Home
          </Link>
          {items.length > 0 && (
            <ChevronRight className="w-4 h-4 text-gray-400 mx-2 font-bold" />
          )}
        </li>

        {/* Add dynamic breadcrumbs */}
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index === items.length - 1 ? (
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {item}
              </span>
            ) : (
              <Link
                to={`/${items
                  .slice(0, index + 1)
                  .join("/")
                  .toLowerCase()}`}
                className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-dark p-2"
              >
                {item}
              </Link>
            )}
            {index < items.length - 1 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2 font-bold" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
