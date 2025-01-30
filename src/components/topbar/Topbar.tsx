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
  const initials =
    name?.length > 2
      ? name
          ?.split(" ")
          .map((n: string, index: number) => {
            if (index < 2) {
              return n[0]; // Get the first letter of the first two words
            }
            return ""; // Ignore other words
          })
          .join("")
          .toUpperCase()
      : name?.length > 1
      ? name?.slice(0, 2).toUpperCase()
      : name?.[0]?.toUpperCase().repeat(2);
  return (
    <>
      <div className="max-md:hidden bg-gray-950 border-b border-gray-800 pb-1">
        <div className="flex w-full justify-between items-center container py-2">
          <div className="flex-1">
            <div className="flex items-center justify-start max-w-7xl mx-auto text-white leading-8">
              <Breadcrumbs />
            </div>
          </div>
          <div className="md:hidden p-2 h-[68px] bg-gray-950">
            <div className="flex items-center justify-center max-w-7xl mx-auto text-white h-full">
              <Breadcrumbs />
            </div>
            t
          </div>
          <div className="flex-1 flex items-center justify-end me-5">
            <Popover backdrop="blur" placement="bottom" offset={10}>
              <PopoverTrigger className="border-1 border-black rounded-full p-1">
                <div className="flex items-center gap-4">
                  <div className="text-gray-300">{name}</div>
                  <User className="text-white cursor-pointer border p-1 rounded-full hover:text-accent transition ease-in-out duration-200 h-8 w-8" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-4 w-72 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="flex items-center w-full">
                  <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center font-bold text-xl">
                    {initials}
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
