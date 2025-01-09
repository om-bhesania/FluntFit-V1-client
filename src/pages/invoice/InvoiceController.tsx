import { useEffect, useState } from "react";
import useToast from "../../hooks/useToast";
import service from "../../services/services";
import apiUrls from "../../utils/apiUrls";
import InvoiceComponent from "./InvoiceComponent";
import {
  initialValues,
  validationSchema,
} from "../../../customerDetails/CustomerDetailsController";
import { FormValues } from "../../../customerDetails/CustomerDetailsModal";

export interface InvoiceComponentType {
  onRowClick: (data: any) => void;
  generatePDF: () => void;
  columns: any;
  data: any;
  selectedData: any;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  initialValues?: FormValues;
  validationSchema?: any;
  onSubmit?: (
    values?: FormValues,
    actions?: { setSubmitting: (isSubmitting: boolean) => void }
  ) => void;
  handleOpenModal?: any;
  handleCloseModal?: any;
  handleSubmit?: any;
  productData: any;
}
function InvoiceController() {
  const [selectedData, setSelectedData] = useState(null);
  const [ProductData, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { notify } = useToast();

  const onRowClick = (data: any) => {
    handleOpenModal();
    setSelectedData(data);
  };
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    try {
      const result: any = await service({
        method: "get",
        url: apiUrls.products.get,
      });
      setData(result?.products || []);
    } catch (error: any) {
      notify(error?.response.data.message, { type: "error" });
    } finally {
    }
  };
  const generatePDF = () => {
    // Logic to generate PDF
  };
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
      maxWidth: 10,
    },

    {
      header: "Product Name",
      accessorKey: "productName",
      cell: ({ row }: any) => row.original.productName,
    },
    {
      header: "Product Description",
      accessorKey: "productDescription",
      cell: ({ row }: any) => row.original.productDescription,
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: ({ row }: any) => row.original.category,
    },
    {
      header: "Subcategory",
      accessorKey: "subcategory",
      cell: ({ row }: any) => row.original.subcategory,
    },
    {
      header: "Product Type",
      accessorKey: "productType",
      cell: ({ row }: any) => row.original.productType,
    },
    {
      header: "Brand",
      accessorKey: "brand",
      cell: ({ row }: any) => row.original.brand,
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: ({ row }: any) => row.original.price,
    },
    {
      header: "Cost Price",
      accessorKey: "Costprice",
      cell: ({ row }: any) => row.original.costPrice,
    },
    {
      header: "Sale Price",
      accessorKey: "salePrice",
      cell: ({ row }: any) =>
        row.original.salePrice === null ? "-" : row.original.salePrice,
    },
    {
      header: "Profit Margin",
      accessorKey: "Profit Margin",
      cell: ({ row }: any) => {
        const costPrice = row.original.costPrice;
        const price =
          row.original.salePrice !== null
            ? row.original.salePrice
            : row.original.price;
        if (costPrice === 0) {
          return "100%";
        }
        const profitMargin = ((price - costPrice) / costPrice) * 100;

        return `${profitMargin.toFixed(2)}%`;
      },
    },
    {
      header: "Profit Earned",
      accessorKey: "Profit",
      cell: ({ row }: any) => {
        const costPrice = row.original.costPrice;
        const price =
          row.original.salePrice !== null
            ? row.original.salePrice
            : row.original.price;
        if (costPrice === 0) {
          return `₹${price.toFixed(2)}`;
        }
        const profitEarned = price - costPrice;
        return `₹${profitEarned.toFixed(2)}`;
      },
    },
    { header: "SKU", accessorKey: "sku" },
    {
      header: "Quantity In Stock",
      accessorKey: "quantityInStock",
      cell: ({ row }: any) => row.original.quantityInStock,
    },
    {
      header: "Size Options",
      accessorKey: "sizeOptions",
      cell: ({ row }: any) => row.original.sizeOptions.toString(),
    },

    {
      header: "Care Instructions",
      accessorKey: "careInstructions",
      cell: ({ row }: any) => row.original.careInstructions,
    },
    {
      header: "Inventory Status",
      accessorKey: "inventoryStatus",
      cell: ({ row }: any) => row.original.inventoryStatus,
    },
  ];

  const handleSubmit = (
    // values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setSubmitting(false);
    setIsOpen(false);
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);
  const onSubmit = () => {};
  return (
    <>
      <InvoiceComponent
        onRowClick={onRowClick}
        generatePDF={generatePDF}
        columns={columns}
        data={ProductData}
        selectedData={selectedData}
        isOpen={isOpen}
        onOpen={handleOpenModal}
        onClose={handleCloseModal}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        productData={selectedData}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default InvoiceController;
