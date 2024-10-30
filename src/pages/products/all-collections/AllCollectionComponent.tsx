import { Button } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
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
        <div className="text-end">
          <Button
            variant="bordered"
            color="primary"
            onClick={() => navigate("/dashboard/add-product")}
          >
            <PlusIcon size={15} /> Add Product
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
    </div>
  );
};

export default AllCollectionComponent;
