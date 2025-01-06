import React from "react";

const InvoicePreview = ({ data }:any) => {
  if (!data) {
    return (
      <p className="text-gray-500">
        No row selected. Please select a row to preview the invoice.
      </p>
    );
  }

  return (
    <div className="p-4 border rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Invoice Preview</h3>
      <p>
        <strong>Name:</strong> {data.name}
      </p>
      <p>
        <strong>Amount:</strong> ${data.amount}
      </p>
      <p>
        <strong>Date:</strong> {data.date}
      </p>
      <p>
        <strong>Invoice ID:</strong> {`INV-${data.id}`}
      </p>
    </div>
  );
};

export default InvoicePreview;
