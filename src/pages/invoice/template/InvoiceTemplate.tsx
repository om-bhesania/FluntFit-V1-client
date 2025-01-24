import React, { useEffect, useState } from "react";
import { InvoiceProps } from "./types";

const InvoiceTemplate: React.FC<InvoiceProps> = ({
  className,
  items,
  discountRate,
  customerData,

  invoiceData,
}) => {
  const productIds = Object.keys(invoiceData.allData.productName);
  console.log("productIds", productIds);
  const [productData, setProductData] = useState<any>([]);

  useEffect(() => {
    if (!productIds || !invoiceData?.allData) {
      setProductData([]);
      return; // Skip if data is not yet available
    }

    const generateUniqueProducts = () => {
      const uniqueProducts: any[] = [];
      productIds.forEach((productId) => {
        const productName = invoiceData.allData.productName[productId];
        const productGst = invoiceData.allData.productGst[productId];
        const productQuantity =
          invoiceData.allData.productQuantity[productId] || 1;
        const productPrice = invoiceData.allData.productPrice[productId];
        const productPriceTotal =
          invoiceData.allData.productPriceTotal[productId];
        const productUnitPrice =
          invoiceData.allData.productUnitPrice[productId];

        // Check if the product already exists in the uniqueProducts array
        if (
          !uniqueProducts.some(
            (product) =>
              product.productName === productName &&
              product.productGst === productGst &&
              product.productQuantity === productQuantity &&
              product.productPrice === productPrice &&
              product.productPriceTotal === productPriceTotal &&
              product.productUnitPrice === productUnitPrice
          )
        ) {
          uniqueProducts.push({
            productName,
            productGst,
            productQuantity,
            price: productPrice,
            total:
              productQuantity === 1
                ? productPrice
                : productPrice * productQuantity,
            discount: productUnitPrice,
          });
        }
      });

      return uniqueProducts;
    };
    const uniqueProducts = generateUniqueProducts();
    setProductData((prevData: any) => {
      // Only update state if the data has changed
      if (JSON.stringify(prevData) !== JSON.stringify(uniqueProducts)) {
        return uniqueProducts;
      }
      return prevData;
    });
  }, [productIds, invoiceData?.allData]); // Add only necessary dependencies

  // Calculate the subtotal of items
  const calculateSubtotal = () => {
    return items.reduce(
      (sum: any, item: any) => sum + item.quantity * item.price,
      0
    );
  };

  // Calculate the discount on the subtotal
  const calculateDiscount = (subtotal: number) => {
    return (subtotal * Number(discountRate)) / 100;
  };

  // Calculate the cash discount (flat amount)
  const calculateCashDiscount = (subtotal: number) => {
    // Ensure the cash discount does not exceed the subtotal
    return invoiceData.cashDiscountRate > subtotal
      ? subtotal
      : invoiceData.cashDiscountRate;
  };

  // Calculate the CGST
  const calculateCGST = (subtotal: number, discount: number) => {
    return ((subtotal - discount) * (invoiceData.taxRate / 2)) / 100;
  };

  // Calculate the SGST
  const calculateSGST = (subtotal: number, discount: number) => {
    return ((subtotal - discount) * (invoiceData.taxRate / 2)) / 100;
  };

  // Calculate the tax on the subtotal after applying discount
  const calculateTax = (subtotal: number, discount: number) => {
    return ((subtotal - discount) * invoiceData.taxRate) / 100;
  };

  // Calculate the total after applying discounts and adding tax
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const percentageDiscount = calculateDiscount(subtotal);
    const cashDiscount = calculateCashDiscount(subtotal);
    const totalDiscount = percentageDiscount + cashDiscount; // Combine both discounts
    const tax = calculateTax(subtotal, totalDiscount);
    return subtotal - totalDiscount + tax;
  };

  // In the render section:
  const subtotal = calculateSubtotal();
  const percentageDiscount = calculateDiscount(subtotal);
  const cashDiscount = calculateCashDiscount(subtotal);
  const totalDiscount = percentageDiscount + cashDiscount;
  const cgst = calculateCGST(subtotal, totalDiscount);
  const sgst = calculateSGST(subtotal, totalDiscount);
  const total = calculateTotal();
  return (
    <div className="max-md:container">
      <div
        className={`${className} md:max-w-7xl max-w-full  md:mx-auto md:p-8 p-6 bg-white`}
      >
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div className="flex gap-4">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-19%20at%2002.45.23_28196d38.jpg-J3coLONODvzAS04uKhUl4pNkAy20yQ.jpeg"
              alt="Mix Bunch Logo"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-semibold">Mix Bunch</h1>
              <p className="text-sm text-gray-600">Shop No-10, Fortune Air,</p>
              <p className="text-sm text-gray-600">Krunal Char Rasta, Gotri,</p>
              <p className="text-sm text-gray-600"> Vadodara-390021</p>
              <p className="text-sm text-gray-600">Ph:- 7043745089</p>
              <p className="text-sm text-gray-600 mt-2">
                GSTIN:- 24IZRPK5753C1Z1
              </p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl">Blend Of Fashion</h2>
            <div className="text-sm text-gray-600 mt-2">
              <p>{customerData?.name || "Customer Name"}</p>
              <p>{customerData?.phone || "Customer Name"}</p>
              <p>{customerData?.city || "City"} </p>
              <p> {customerData?.state || "State"} </p>
              <p> Place of supply:{customerData?.state || "State"}</p>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="mb-8">
          <h2 className="text-xl mb-4">
            Customer Invoices {invoiceData.invoiceNumber}
          </h2>
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Invoice Date:</p>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Due Date:</p>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-center">Name</th>
              <th className="py-2 text-center">Quantity</th>
              <th className="py-2 text-center">Price</th>
              <th className="py-2 text-center">Disc.%</th>
              <th className="py-2 text-center">Unit Price</th>
              <th className="py-2 text-center">Total Price</th>
              <th className="py-2 text-center">Taxes</th>
              <th className="py-2 text-center">Amount</th>
            </tr>
          </thead>
          <tbody>
            {productData.map((product: any, index: number) => (
              <tr key={`${product.id}-${index}`}>
                <td className="py-2 text-center">{product.productName}</td>
                <td className="py-2 text-center">{product?.productQuantity}</td>
                <td className="py-2 text-center">₹ {product?.price}</td>
                <td className="py-2 text-center">
                  {!discountRate && "₹"}
                  {!discountRate && (product.discount - product?.price )||
                    discountRate}{" "}
                  {(discountRate && "%") || ""}
                </td>
                <td className="py-2 text-center">₹{product.discount}</td>
                <td className="py-2 text-center">₹ {product?.total}</td>
                <td className="py-2 text-center">{product?.productGst}</td>
                <td className="text-center py-2">
                  ₹{product?.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="w-full max-w-md ml-auto">
          <div className="space-y-2">
            <div className="flex justify-between border-b py-1">
              <span>Untaxed Amount</span>
              <span>₹ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b py-1">
              <span>Discount</span>
              <span>- ₹ {percentageDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b py-1">
              <span>Taxable Amount</span>
              <span>₹ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b py-1 pl-4 text-gray-700 text-sm">
              <span>- SGST</span>
              <span>₹ {sgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b py-1 pl-4 text-gray-700 text-sm">
              <span>- CGST</span>
              <span>₹ {cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b py-1 font-semibold">
              <span>Total</span>
              <span>₹ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b py-1 text-gray-600">
              <span>Paid on {new Date().toLocaleDateString()}</span>
              <span>₹ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 font-semibold">
              <span>Credit</span>
              <span>₹ 0.00</span>
            </div>
          </div>
        </div>

        {/* HSN Summary */}
        {/* <div className="mt-8">
          <h2 className="text-xl mb-4">HSN Summary</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">HSN/SAC</th>
                <th className="text-left py-2">Quantity</th>
                <th className="text-left py-2">Rate %</th>
                <th className="text-right py-2">Taxable Value</th>
              </tr>
            </thead>
           
          </table>
        </div> */}

        {/* Payment Info */}
        <div className="mt-8">
          <p className="text-sm text-gray-600">
            Payment Communication: INV/2025/00006
          </p>
          <p className="text-sm text-gray-600 mt-4">
            Our return policy allows for returns within 10 days of receiving
            your item. To qualify for a return, the item must be unused and in
            the same condition as when you received it, with tags attached and
            in its original packaging. A proof of purchase is also required.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <a
            href="http://www.mixbunch.in"
            className="text-blue-600 hover:underline"
          >
            www.mixbunch.in
          </a>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
