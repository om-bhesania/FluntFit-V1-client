import React from "react";
import Barcode from "react-barcode"; // Use a barcode generator library

interface LabelProps {
  productName: string;
  price: string;
  salePrice: string;
  barcode: string;
}

const Label: React.FC<LabelProps> = ({
  productName,
  price,
  salePrice,
  barcode,
}) => {
  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-white w-64">
      <div className="text-center font-bold text-lg">{productName}</div>
      <div className="mt-2 text-sm">
        <div>Price: ₹{price}</div>
        <div>Sale Price: ₹{salePrice}</div>
      </div>
      <div className="mt-4 flex justify-center">
        <Barcode value={barcode} width={2} height={50} fontSize={12} />
      </div>
      <div className="mt-4 text-xs text-center">
        Manufactured & Packed by: Static Text
        <br />
        Address: Static Address
      </div>
    </div>
  );
};

export default Label;
