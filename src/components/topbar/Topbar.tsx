import Breadcrumbs from "../breadCrumbs/BreadCrumbs";

interface BreadcrumbItemProps {
  breadcrumbs?: string[];
}

const TopBar: React.FC<BreadcrumbItemProps> = () => {
  return (
    <div className="p-2 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-start max-w-7xl mx-auto text-primary">
        <Breadcrumbs />
      </div>
    </div>
  );
};

export default TopBar;
