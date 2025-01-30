import React from "react";
import Table from "../../../components/table/Table";
import { exportToCSV } from "../../../hooks/useExportCsv";

interface InvoiceHistoryComponentProps {
  columns: any[];
  data: any[];
  loading: boolean; 
}

const InvoiceHistoryComponent: React.FC<InvoiceHistoryComponentProps> = ({
  columns,
  data,
  loading, 
}) => {
  const handleExport = () => {
    exportToCSV(data, "AllCollections");
  };

  return (
    <div className="container mt-6">
      <Table
        data={data}
        columns={columns}
        pageCount={Math.ceil(data.length / 15)}
        className="text-black mt-6"
        loading={loading}
        handleExport={handleExport}
        isAddBtnVisible={true}
        btnLink="/products/add-products"
      />
    </div>
  );
};

export default InvoiceHistoryComponent;
