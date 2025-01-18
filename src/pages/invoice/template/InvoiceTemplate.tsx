import React from "react";
import { InvoiceProps } from "./types";

const InvoiceTemplate: React.FC<InvoiceProps> = ({
  className,
  items,
  discountRate,
  customerData,
  calculateSubtotal,
  calculateDiscount,
  calculateCGST,
  calculateSGST,
  calculateTotal,
  invoiceData,
}) => {
  const subtotal = calculateSubtotal();
  const discount = calculateDiscount(subtotal);
  const cgst = calculateCGST(subtotal, discount);
  const sgst = calculateSGST(subtotal, discount);
  const total = calculateTotal();
  console.log("invoiceData", invoiceData);
  return (
    <div className="max-md:container">
      <div
        className={`${className} md:max-w-4xl max-w-full  md:mx-auto md:p-8 p-6 bg-white`}
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
          <h2 className="text-xl mb-4">Customer Invoices INV/2025/00006</h2>
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
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">HSN/SAC</th>
              <th className="text-left py-2">Quantity</th>
              <th className="text-left py-2">Unit Price</th>
              <th className="text-left py-2">Disc.%</th>
              <th className="text-left py-2">Taxes</th>
              <th className="text-right py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any) => (
              <tr key={item.id}>
                <td className="py-2">{item?.productName}</td>
                <td className="py-2"></td>
                <td className="py-2">{item?.quantity.toFixed(2)}</td>
                <td className="py-2">₹ {item?.price.toFixed(2)}</td>
                <td className="py-2">{discountRate}%</td>
                <td className="py-2">GST {item?.gst}%</td>
                <td className="text-right py-2">₹ {item?.total.toFixed(2)}</td>
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
              <span>SGST</span>
              <span>₹ {sgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b py-1">
              <span>CGST</span>
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
              <span>Amount Due</span>
              <span>₹ 0.00</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            Total amount in words:
            <br />
            {/* You would need to implement a number-to-words function here */}
            {/* For now, we'll leave it as is */}
            One Thousand Four Hundred And Eighty-Nine Rupees and Sixty Paise
          </p>
        </div>

        {/* HSN Summary */}
        <div className="mt-8">
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
            {/* You can add the HSN summary data here if available */}
          </table>
        </div>

        {/* Payment Info */}
        <div className="mt-8">
          <p className="text-sm text-gray-600">
            Payment Communication: INV/2025/00006
          </p>
          <p className="text-sm text-gray-600 mt-4">
            Our return policy allows for returns within 01 days of receiving
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
          <p className="text-sm text-gray-600 mt-2">Page: 1/2</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
