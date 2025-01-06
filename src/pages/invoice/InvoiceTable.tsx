import React from "react";
import Table from "../../components/table/Table";

const InvoiceTable = ({ data, columns, onRowClick }:any) => {
  const handleRowClick = (row:any) => {
    if (onRowClick) {
      onRowClick(row.original); // Pass selected row data to the parent component
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold mb-4">Invoice Data</h2>
      <Table
        data={data}
        columns={columns}
        loading={false} // Replace with a loading state if needed
        handleExport={() => console.log("Exporting data...")}
        isAddBtnVisible={false} // Hide the "Add Product" button 
        onClick={handleRowClick} // Pass the row click handler
      />
    </div>
  );
};

export default InvoiceTable;
