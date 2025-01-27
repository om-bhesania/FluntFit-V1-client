const InvoiceTemplate = ({ invoiceData, className }: any) => {
  const taxableAmount = (
    parseFloat(invoiceData?.totalUntaxedAmount) -
      parseFloat(invoiceData?.totalDiscount) || 0.0
  ).toFixed(2);
  
  return (
    <div className="max-md:container">
      <div
        className={`${className} md:max-w-5xl max-w-full  md:mx-auto md:p-8 p-6 bg-white`}
      >
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div className="flex gap-4">
            <img
              src="//mixbunch.in/cdn/shop/files/logo4.png?v=1703583291&width=600"
              alt="Mix Bunch Logo"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-semibold">Mix Bunch</h1>
              <h2 className="text-xl">Blend Of Fashion</h2>
              <p className="text-sm text-gray-600">Shop No-10, Fortune Air,</p>
              <p className="text-sm text-gray-600">Krunal Char Rasta, Gotri,</p>
              <p className="text-sm text-gray-600"> Vadodara-390021</p>
              <p className="text-sm text-gray-600">Ph:- 7043745089</p>
              <p className="font-semibold text-gray-600 mt-2">
                GSTIN:- 24IZRPK5753C1Z1
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mt-2">
              <br />
              <p>{invoiceData?.name || "Customer Name"}</p>
              <p>{invoiceData?.phone || "Customer Name"}</p>
              <p>{invoiceData?.city || "City"} </p>
              <p> {invoiceData?.state || "State"} </p>
              <p> Place of supply:{invoiceData?.state || "State"}</p>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="mb-8">
          <h2 className="text-xl mb-4">
            Customer Invoices {invoiceData?.invoiceNumber}
          </h2>
        </div>

        {/* Invoice Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-center text-sm px-1.5 whitespace-nowrap">
                Name
              </th>
              <th className="py-2 text-center text-sm px-1.5 whitespace-nowrap">
                {" "}
                HSN/SAC
              </th>
              <th className="py-2 text-center text-sm px-1.5 whitespace-nowrap">
                Quantity
              </th>
              <th className="py-2 text-center text-sm px-1.5 whitespace-nowrap">
                Price
              </th>
              <th className="py-2 text-center text-sm px-1.5 whitespace-nowrap">
                Discount %
              </th>
              <th className="py-2 text-center text-sm px-1.5 whitespace-nowrap">
                Total Price
              </th>
              <th className="py-2 text-center text-sm px-1.5 whitespace-nowrap">
                Taxes
              </th>
              <th className="py-2 text-center text-sm px-1.5 whitespace-nowrap">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoiceData?.items?.map((product: any, index: number) => 
              product.item && product.item !== "" && (
              <tr key={`${product.id}-${index}`}>
                <td className="py-2 text-center">{product.item}</td>
                <td className="py-2 text-center">{product.hsnSac || ""}</td>
                <td className="py-2 text-center">
                {product.quantity || 0.0}
                </td>
                <td className="py-2 text-center">₹{product?.price || 0.0}</td>
                <td className="py-2 text-center">
                {product?.productDiscount || 0.0}
                </td>
                <td className="py-2 text-center">
                ₹ {parseInt(product?.total).toFixed(2) || 0.0}
                </td>
                <td className="py-2 text-center">{product?.gst || 0.0}%</td>
                <td className="text-center py-2">
                ₹{product?.total.toFixed(2) || 0.0}
                </td>
              </tr>
              )
            )}
          </tbody>
        </table>

        {/* Summary */}
        <div className="w-full max-w-md ml-auto">
          <div className="space-y-2">
            <div className="flex justify-between border-b py-1">
              <span>Untaxed Amount</span>
              <span>
                ₹{" "}
                {parseFloat(invoiceData?.totalUntaxedAmount || 0.0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-b py-1">
              <span>Discount</span>
              <span>
                - ₹ {parseInt(invoiceData?.totalDiscount || 0.0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-b py-1">
              <span>Taxable Amount</span>
              <span>₹ {taxableAmount}</span>
            </div>
            <div className="flex justify-between border-b py-1 pl-4 text-gray-700 text-sm">
              <span>- SGST</span>
              <span>₹ {parseInt(invoiceData?.sgst || 0.0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b py-1 pl-4 text-gray-700 text-sm">
              <span>- CGST</span>
              <span>₹ {parseInt(invoiceData?.cgst || 0.0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b py-1 font-semibold">
              <span>Total</span>
              <span>₹ {invoiceData?.totalBillingAmount || 0.0}</span>
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
            Payment Communication: {invoiceData?.invoiceNumber}
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
