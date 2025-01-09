interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceData {
  invoiceId: string;
  date: string;
  dueDate: string;
  customerName: string;
  customerEmail: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  items: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

const InvoicePreview = ({ data }: { data: InvoiceData | null }) => {
  if (!data) {
    return (
      <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <p className="text-gray-500 text-center">
          No invoice selected. Please select an invoice to preview.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 bg-gray-50">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Invoice</h1>
            <p className="text-gray-600 mt-1">#{data.invoiceId}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-lg text-gray-800">
              {data.companyName}
            </p>
            <p className="text-sm text-gray-600">{data.companyAddress}</p>
            <p className="text-sm text-gray-600">{data.companyEmail}</p>
            <p className="text-sm text-gray-600">{data.companyPhone}</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-700">
              Bill To:
            </h2>
            <p className="text-gray-600">{data.customerName}</p>
            <p className="text-gray-600">{data.customerEmail}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">
              <span className="font-semibold">Invoice Date:</span> {data.date}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Due Date:</span> {data.dueDate}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {data.items && data.items.length > 0 ? (
            <table className="w-full mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-gray-700">
                    Description
                  </th>
                  <th className="px-4 py-2 text-right text-gray-700">Qty</th>
                  <th className="px-4 py-2 text-right text-gray-700">
                    Unit Price
                  </th>
                  <th className="px-4 py-2 text-right text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2 text-gray-600">
                      {item.description}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-600">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-600">
                      ${item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-600">
                      ${item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center mb-6">
              No items found for this invoice.
            </p>
          )}
        </div>

        <div className="mt-6 text-right">
          <p className="mb-2 text-gray-600">
            <span className="font-semibold">Subtotal:</span> $
            {data.subtotal?.toFixed(2) ?? "0.00"}
          </p>
          <p className="mb-2 text-gray-600">
            <span className="font-semibold">Tax ({data.taxRate ?? 0}%):</span> $
            {data.taxAmount?.toFixed(2) ?? "0.00"}
          </p>
          <p className="text-xl font-bold text-gray-800">
            <span>Total:</span> ${data.total?.toFixed(2) ?? "0.00"}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Thank you for your business!
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
