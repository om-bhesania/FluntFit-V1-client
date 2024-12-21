import React from "react";
import Table from "../../../components/table/Table";
import { exportToCSV } from "../../../hooks/useExportCsv";
 

interface AllCollectionComponentProps {
  columns: any[];
  data: any[];
  loading: boolean;
}

const AllCollectionComponent: React.FC<AllCollectionComponentProps> = ({
  columns,
  data,
  loading,
}) => {
  const handleExport = () => {
    exportToCSV(data, "AllCollections");
  };

  return (
    <div className="mt-6"> 
      <Table
        data={data}
        columns={columns}
        pageCount={Math.ceil(data.length / 15)}
        className="text-black"
        loading={loading}
        handleExport={handleExport}
      />
    </div>
  );
};

export default AllCollectionComponent;
