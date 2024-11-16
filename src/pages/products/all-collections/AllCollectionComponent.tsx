import React from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/table/Table";

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
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="mt-6">
        <Table
          data={data}
          columns={columns}
          pageCount={Math.ceil(data.length / 15)}
          className="text-black"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AllCollectionComponent;
