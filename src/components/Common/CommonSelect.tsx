import React from "react";
import {
  Select as NextUISelect,
  SelectProps as NextUISelectProps,
  SelectItem,
} from "@nextui-org/react";

export interface CommonSelectProps extends Omit<NextUISelectProps, "children"> {
  options?: Array<{
    _id: string;
    [key: string]: any;
  }>;
  labelKey?: string;
  valueKey?: string;
  children?: any;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  classNames?: {
    base?: string;
    trigger?: string;
    label?: string;
    listbox?: string;
    popover?: string;
    helpText?: string;
    description?: string;
    errorMessage?: string;
    selectorWrapper?: string;
    value?: string;
    innerWrapper?: string;
    mainWrapper?: string;
    spinner?: string;
    listboxWrapper?: string;
    title?: string;
    wrapper?: string;
  };
}

const CommonSelect: React.FC<CommonSelectProps> = ({
  options = [],
  labelKey = "label",
  valueKey = "_id",
  onChange,
  children,
  classNames = {},
  ...props
}) => {
  const darkThemeClassNames = {
    base: "max-w-full",
    trigger:
      "h-10 bg-gray-950 border border-gray-700 rounded-md shadow-sm px-4 py-2 text-sm text-white",
    value: "text-white",
    menu: "bg-gray-950 border border-gray-700 rounded-md shadow-lg",
    item: "px-4 py-2 text-sm text-white cursor-pointer data-[hover=true]:bg-gray-700 data-[selected=true]:bg-blue-500 !outline-0",
    ...classNames,
  };

  // Handle the case where children are provided directly
  if (children) {
    return (
      <NextUISelect {...props} classNames={darkThemeClassNames}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === SelectItem) {
            return React.cloneElement(child as React.ReactElement<any>, {
              className: "bg-gray-800 text-white",
            });
          }
          return child;
        })}
      </NextUISelect>
    );
  }

  // Handle the case where options are provided
  return (
    <NextUISelect {...props} classNames={darkThemeClassNames}>
      {options.map((option) => (
        <SelectItem
          key={option[valueKey]}
          value={option[valueKey]}
          className="bg-gray-800 text-white"
        >
          {option[labelKey]}
        </SelectItem>
      ))}
    </NextUISelect>
  );
};

export default CommonSelect;
