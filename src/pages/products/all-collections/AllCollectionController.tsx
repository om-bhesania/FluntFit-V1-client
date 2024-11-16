import { Button, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import EditModal from "../../../components/modal/EditModal";
import useToast from "../../../hooks/useToast";
import service from "../../../services/services";
import apiUrls from "../../../utils/apiUrls";
import { AddProducts } from "../addProduct";
import { DeleteProductApi, EditProductApi } from "../ProductsApi";
import AllCollectionComponent from "./AllCollectionComponent";

function AllCollectionController() {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { notify } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const result: any = await service({
        method: "get",
        url: apiUrls.products.get,
      });
      setData(result?.products || []);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await DeleteProductApi(id, notify);
      loadData();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const { onOpen: openModal, onClose: closeModal } = useDisclosure();

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    handleOpen();
  };

  const handleOpen = () => {
    setModalOpen(true);
    openModal();
  };

  const handleClose = () => {
    setModalOpen(false);
    closeModal();
  };

  const handleSaveEdit = async (id: string, data: any) => {
    try {
      await EditProductApi(id, notify, data);
      loadData();
      handleClose();
    } catch (error) {
      console.error("Edit failed:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns = [
    {
      header: "Serial Number",
      accessorKey: "serialNumber",
      cell: ({ row }: any) => row.index + 1,
    },
    { header: "Product Name", accessorKey: "productName" },
    { header: "Product Description", accessorKey: "productDescription" },
    { header: "Category", accessorKey: "category" },
    { header: "Subcategory", accessorKey: "subcategory" },
    { header: "Product Type", accessorKey: "productType" },
    { header: "Brand", accessorKey: "brand" },
    { header: "Price", accessorKey: "price" },
    { header: "Sale Price", accessorKey: "salePrice" },
    { header: "SKU", accessorKey: "sku" },
    { header: "Quantity In Stock", accessorKey: "quantityInStock" },
    { header: "Media Content", accessorKey: "mediaContent" },
    { header: "Size Options", accessorKey: "sizeOptions" },
    { header: "Color Options", accessorKey: "colorOptions" },
    { header: "Care Instructions", accessorKey: "careInstructions" },
    { header: "Inventory Status", accessorKey: "inventoryStatus" },
    { header: "Country of Origin", accessorKey: "countryOfOrigin" },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }: any) => (
        <div className="flex justify-center items-center gap-2">
          <EditModal
            handleModalOpen={modalOpen}
            triggerLabel="Edit"
            onOpen={() => handleEdit(row.original)}
            onClose={handleClose}
            title="Edit Product"
            bodyContent={
              <AddProducts
                isEdit
                prefilledData={selectedProduct}
                handleSaveEdit={handleSaveEdit}
              />
            }
            footerButtons={[
              { onPress: handleClose, label: "Cancel" },
              {
                onPress: () =>
                  document
                    ?.querySelector("form")
                    ?.dispatchEvent(new Event("submit", { cancelable: true })),
                label: "Save",
              },
            ]}
          />
          <Button
            onClick={() => handleDelete(row.original.id)}
            variant="bordered"
            color="danger"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AllCollectionComponent columns={columns} data={data} loading={loading} />
    </>
  );
}

export default AllCollectionController;
