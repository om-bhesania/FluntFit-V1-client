import Breadcrumbs from "../breadCrumbs/BreadCrumbs";

interface BreadcrumbItemProps {
  breadcrumbs?: string[];
}

const TopBar: React.FC<BreadcrumbItemProps> = () => {
  return (
    <>
      <div className="max-md:hidden p-2 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-start max-w-7xl mx-auto text-primary">
          <Breadcrumbs />
        </div>
      </div>
      <div className="md:hidden p-2 h-[68px] bg-white dark:bg-gray-800">
        <div className="flex items-center justify-center max-w-7xl mx-auto text-primary h-full">
          <Breadcrumbs />
        </div>
      </div>
    </>
  );
};

export default TopBar;
