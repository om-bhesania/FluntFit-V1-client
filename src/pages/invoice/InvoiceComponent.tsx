import React, { useState } from "react";
import InvoiceTable from "./InvoiceTable";
import InvoicePreview from "./InvoicePreview";

function InvoiceComponent() {
  const [selectedData, setSelectedData] = useState(null);

  const handleRowClick = (data: any) => {
    setSelectedData(data);
  };

  const generatePDF = () => {
    // Logic to generate PDF
    console.log("Generating PDF for", selectedData);
  };
  const columns = [
    {
      accessorKey: "invoiceId",
      header: "Invoice ID",
      cell: ({ getValue }:any) => <span>{getValue()}</span>,
    },
    {
      accessorKey: "customerName",
      header: "Customer Name",
      cell: ({ getValue }:any) => <span>{getValue()}</span>,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ getValue }:any) => <span>${getValue()}</span>,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ getValue }:any) => (
        <span>{new Date(getValue()).toLocaleDateString()}</span>
      ),
    },
  ];

  const data = [
    {
      invoiceId: "INV-001",
      customerName: "John Doe",
      amount: 250,
      date: "2025-01-01",
    },
    {
      invoiceId: "INV-002",
      customerName: "Jane Smith",
      amount: 450,
      date: "2025-01-02",
    },
    {
      invoiceId: "INV-003",
      customerName: "Tom Johnson",
      amount: 150,
      date: "2025-01-03",
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Table Section */}
      <div className="w-1/2 p-4 bg-gray-200 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Invoice Data</h2>
        <InvoiceTable onRowClick={handleRowClick} columns={columns} data={data} />
      </div>

      {/* Invoice Preview Section */}
      <div className="w-1/2 p-4 bg-white overflow-y-auto shadow-lg">
        <h2 className="text-lg font-bold mb-4">Invoice Preview</h2>
        <InvoicePreview data={selectedData} />
        <button
          onClick={generatePDF}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          disabled={!selectedData}
        >
          Generate & Download Invoice
        </button>
      </div>
    </div>
  );
}

export default InvoiceComponent;
