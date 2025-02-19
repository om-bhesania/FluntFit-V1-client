import React from "react";
import {
  Select as NextUISelect,
  SelectProps as NextUISelectProps,
  SelectItem,
} from "@nextui-org/react";
import { darkSelectClassNames } from "../../utils/utils";

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
  // Handle the case where children are provided directly
  if (children) {
    return (
      <NextUISelect {...props} classNames={darkSelectClassNames}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === SelectItem) {
            return React.cloneElement(child as React.ReactElement<any>, {});
          }
          return child;
        })}
      </NextUISelect>
    );
  }

  // Handle the case where options are provided
  return (
    <NextUISelect {...props} classNames={darkSelectClassNames}>
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
