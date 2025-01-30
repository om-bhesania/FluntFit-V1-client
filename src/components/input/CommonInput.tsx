import { Input } from "@nextui-org/react";

interface CommonInputProps {
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  label?: string;
  variant?: "flat" | "underlined" | "bordered";
  description?: string;
  isInvalid?: boolean;
  endContent?: any;
  defaultValue?: any;
  className?: string;
  type?: string;
  min?: any;
  max?: any;
}

const CommonInput: React.FC<CommonInputProps> = ({
  name,
  value,
  onChange,
  onBlur,
  label,
  variant = "underlined",
  description = "",
  isInvalid = false,
  endContent,
  defaultValue,
  className,
  type,
  min,
  max
}) => {
  return (
    <Input
      classNames={{
        input: "!text-gray-300",
      }}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={() => onBlur}
      label={label}
      variant={variant}
      description={description}
      isInvalid={isInvalid}
      endContent={endContent}
      defaultValue={defaultValue}
      className={className}
      min={min}
      max={max}
    />
  );
};

export default CommonInput;
