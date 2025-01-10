import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { LogOutIcon, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useSessionStorage from "../../hooks/useSessionStorage";
import useToast from "../../hooks/useToast";
import { Logout } from "../../utils/utils";
import Breadcrumbs from "../breadCrumbs/BreadCrumbs";

interface BreadcrumbItemProps {
  breadcrumbs?: string[];
}

const TopBar: React.FC<BreadcrumbItemProps> = () => {
  const name = useSessionStorage("name");
  const email = useSessionStorage("email");
  const isLogin = useSessionStorage("authToken");
  const { notify } = useToast();
  const nav = useNavigate();
  return (
    <>
      <div className="max-md:hidden bg-white dark:bg-gray-800">
        <div className="flex w-full justify-between items-center container p-2">
          <div className="flex-1">
            <div className="flex items-center justify-start max-w-7xl mx-auto text-primary">
              <Breadcrumbs />
            </div>
          </div>
          <div className="md:hidden p-2 h-[68px] bg-white dark:bg-gray-800">
            <div className="flex items-center justify-center max-w-7xl mx-auto text-primary h-full">
              <Breadcrumbs />
            </div>
          </div>
          <div className="flex-1 flex items-center justify-end me-5">
            <Popover backdrop="blur" placement="bottom" offset={10}>
              <PopoverTrigger className="border-1 border-black rounded-full p-1">
                <User className="text-primary cursor-pointer hover:text-accent transition ease-in-out duration-200 h-8 w-8" />
              </PopoverTrigger>
              <PopoverContent className="p-4 w-72 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="flex items-center w-full">
                  <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center font-bold text-xl">
                    {name[0]?.toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {name}
                    </h3>
                    <p className="text-sm text-gray-500">{email}</p>
                  </div>
                </div>
                {isLogin ? (
                  <div className="self-start mt-3 w-full">
                    <button
                      className="flex w-full items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
                      onClick={() => Logout(nav, notify)}
                    >
                      <LogOutIcon className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                ) : null}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopBar;
