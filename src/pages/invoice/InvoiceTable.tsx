import Table from "../../components/table/Table";

const InvoiceTable = ({ data, columns, onRowClick }: any) => {
  return (
    <div className="w-full">
      <Table
        data={data}
        columns={columns}
        loading={false} // Replace with a loading state if needed
        handleExport={() => console.log("Exporting data...")}
        isAddBtnVisible={true} // Hide the "Add Product" button
        onRowClick={onRowClick} // Pass the row click handler
      />
    </div>
  );
};

export default InvoiceTable;
