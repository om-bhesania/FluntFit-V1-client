import { Button, useDisclosure } from "@nextui-org/react";
import { QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { DeleteIcon } from "../../../assets/images/Icon";
import EditModal from "../../../components/modal/EditModal";
import useToast from "../../../hooks/useToast";
import service from "../../../services/services";
import apiUrls from "../../../utils/apiUrls";
import { handleGenerateLabel } from "../../../utils/utils";
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
    } catch (error: any) {
      notify(error?.response.data.message, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await DeleteProductApi(id, notify);
      loadData();
      notify("Product deleted successfully", { type: "success" });
    } catch (error) {
      notify("Failed to delete product", { type: "error" });
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
      notify("Failed to edit product", { type: "error" });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns = [
    {
      header: "Serial Number",
      accessorKey: "serialNumber",
      cell: ({ table, row }: any) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        const serialNumber = pageIndex * pageSize + row.index + 1;
        return serialNumber;
      },
    },

    {
      header: "Product Name",
      accessorKey: "productName",
      cell: ({ row }: any) => row.original.productName,
    },
    // {
    //   header: "Product Description",
    //   accessorKey: "productDescription",
    //   cell: ({ row }: any) => row.original.productDescription,
    // },
    // {
    //   header: "Category",
    //   accessorKey: "category",
    //   cell: ({ row }: any) => row.original.category,
    // },
    // {
    //   header: "Subcategory",
    //   accessorKey: "subcategory",
    //   cell: ({ row }: any) => row.original.subcategory,
    // },
    // {
    //   header: "Product Type",
    //   accessorKey: "productType",
    //   cell: ({ row }: any) => row.original.productType,
    // },
    // {
    //   header: "Brand",
    //   accessorKey: "brand",
    //   cell: ({ row }: any) => row.original.brand,
    // },
    {
      header: "Price",
      accessorKey: "price",
      cell: ({ row }: any) => `₹${row.original.price.toFixed(2)}`,
    },
    {
      header: "Cost Price",
      accessorKey: "costPrice",
      cell: ({ row }: any) => `₹${row.original.costPrice.toFixed(2)}`,
    },
    {
      header: "Sale Price",
      accessorKey: "salePrice",
      cell: ({ row }: any) =>
        row.original.salePrice !== null
          ? `₹${row.original.salePrice.toFixed(2)}`
          : "-",
    },
    {
      header: "Profit Margin",
      accessorKey: "profitMargin",
      cell: ({ row }: any) => {
        const costPrice = row.original.costPrice;
        const sellingPrice =
          row.original.salePrice > 0
            ? row.original.salePrice
            : row.original.price; // Choose salePrice if > 0

        if (costPrice === 0) {
          return "100%";
        }

        const profitMargin = ((sellingPrice - costPrice) / costPrice) * 100;
        return `${profitMargin.toFixed(2)}%`;
      },
    },
    {
      header: "Profit Earned",
      accessorKey: "profitEarned",
      cell: ({ row }: any) => {
        const costPrice = row.original.costPrice;
        const sellingPrice =
          row.original.salePrice > 0
            ? row.original.salePrice
            : row.original.price; // Choose salePrice if > 0

        const profitEarned = sellingPrice - costPrice;
        return `₹${profitEarned.toFixed(2)}`;
      },
    },
    {
      header: "Quantity in Stock",
      accessorKey: "quantityInStock",
      cell: ({ row }: any) => (
        <>
          {isNaN(
            row.original.sizeOptions.reduce(
              (sum: number, item: any) => sum + Number(item.quantity),
              0
            )
          )
            ? 0
            : row.original.sizeOptions.reduce(
                (sum: number, item: any) => sum + Number(item.quantity),
                0
              )}
        </>
      ),
    },
    {
      header: "SKU",
      accessorKey: "sku",
    },

    // {
    //   header: "Size Options",
    //   accessorKey: "sizeOptions",
    //   cell: ({ row }: any) => row.original.sizeOptions.toString(),
    // },

    // {
    //   header: "Care Instructions",
    //   accessorKey: "careInstructions",
    //   cell: ({ row }: any) => row.original.careInstructions,
    // },
    // {
    //   header: "Inventory Status",
    //   accessorKey: "inventoryStatus",
    //   cell: ({ row }: any) => row.original.inventoryStatus,
    // },

    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }: any) => (
        <div className="flex justify-center items-center">
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
            onClick={() => handleDelete(row.original._id)}
            variant={"solid"}
            className="bg-transparent"
            isIconOnly
          >
            <DeleteIcon />
          </Button>
          <Button
            onClick={() => handleGenerateLabel(row.original)}
            variant={"solid"}
            className="bg-transparent"
            isIconOnly
          >
            <QrCode className="text-gray-300" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AllCollectionComponent columns={columns} data={data} loading={loading} />
  );
}

export default AllCollectionController;
