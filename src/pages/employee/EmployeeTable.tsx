import React from "react";
import { exportToCSV } from "../../hooks/useExportCsv";
import Table from "../../components/table/Table";
 
interface InvoiceHistoryComponentProps {
  columns: any[];
  data: any[];
  loading: boolean;
}

const EmployeeTable: React.FC<InvoiceHistoryComponentProps> = ({
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
        data={data || []}
        columns={columns || []}
        // pageCount={Math.ceil(data.length / 15)}
        className="text-black mt-6"
        loading={loading}
        handleExport={handleExport}
        isAddBtnVisible={true}
        btnLink="/employee-management"
        pageSize={5}
        buttonLabel="Add Employee"
      />
    </div>
  );
};

export default EmployeeTable;
