import React, { useEffect, useRef, useState } from "react";

// Define color variants
type ColorVariant =
  | "gray"
  | "red"
  | "yellow"
  | "green"
  | "blue"
  | "indigo"
  | "purple"
  | "pink"
  | "orange"
  | "teal";

// Define size variants
type SizeVariant = "xs" | "sm" | "md" | "lg" | "xl";

// Define font size variants
type FontSizeVariant =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl";

interface BadgeProps {
  content: any;
  color?: ColorVariant;
  size?: SizeVariant;
  fontSize?: FontSizeVariant;
  customHeight?: string;
  customWidth?: string;
  customClass?: string;
  customColor?: string;
  customFontSize?: string;
  index?: any;
  formik?: any;
}

const EditableBadge: React.FC<BadgeProps> = ({
  content,
  color = "blue",
  index,
  formik,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState<any>(content);
  const inputRef = useRef<HTMLInputElement>(null);
  const originalValue = useRef<any>(content);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditableContent(content);
    originalValue.current = content;
  }, [content]);

  const calculateProductTotal = (item: any) => {
    let discountedPrice = item.price * (1 - (item.productDiscount || 0) / 100);
    const priceWithGST = discountedPrice * (1 + item.gst / 100);
    return priceWithGST * item.quantity;
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const numValue = parseFloat(editableContent);

    if (!isNaN(numValue)) {
      const currentItem = formik.values.items[index];
      formik.setFieldValue(`items.${index}.gst`, numValue);

      const newTotal = calculateProductTotal({
        ...currentItem,
        gst: numValue,
      });
      formik.setFieldValue(`items.${index}.total`, newTotal);
    } else {
      // If invalid input, revert to original value
      setEditableContent(originalValue.current);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      setEditableContent(originalValue.current);
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setEditableContent(value);
  };

  const colorClasses: Record<ColorVariant, string> = {
    gray: "bg-gray-100 text-gray-800 border-gray-200",
    red: "bg-red-100 text-red-800 border-red-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    green: "bg-green-100 text-green-800 border-green-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    indigo: "bg-indigo-100 text-indigo-800 border-indigo-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    pink: "bg-pink-100 text-pink-800 border-pink-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
    teal: "bg-teal-100 text-teal-800 border-teal-200",
  };

  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-full border px-3 py-0.5 text-xs";
  return (
    <span
      className={`${baseClasses} ${colorClasses[color]}`}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editableContent}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-12 bg-transparent text-center focus:outline-none text-gray-950"
          style={{ minWidth: "30px" }}
        />
      ) : (
        <>
          {content}
          {content?.props?.children === "Flat Discount" ? "" : "%"}
        </>
      )}
    </span>
  );
};

export default EditableBadge;
