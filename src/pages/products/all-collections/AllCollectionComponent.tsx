import React from "react";
import Table from "../../../components/table/Table";
import { exportToCSV } from "../../../hooks/useExportCsv";
import { Button } from "@nextui-org/react";
import { Download } from "lucide-react";
 

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
      <div className="flex justify-end mb-4">
        <Button
          onClick={handleExport}
          variant="bordered"
          color="primary"
        >
          <Download/> Export as Csv
        </Button>
      </div>
      <Table
        data={data}
        columns={columns}
        pageCount={Math.ceil(data.length / 15)}
        className="text-black"
        loading={loading}
      />
    </div>
  );
};

export default AllCollectionComponent;
