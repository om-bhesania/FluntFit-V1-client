import { Button } from "@nextui-org/react";
import { CustomerDetails } from "../../../customerDetails";
import InvoicePreview from "./InvoicePreview";
import InvoiceTable from "./InvoiceTable";
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
const InvoiceComponent: React.FC<InvoiceComponentType> = ({
  onRowClick,
  columns,
  data,
  selectedData,
  generatePDF,
  validationSchema,
  handleOpenModal,
  handleCloseModal,
  handleSubmit,
  initialValues,
  isOpen,
  onOpen,
  onClose,
  productData,
}) => {
  return (
    <div className="flex h-screen">
      {/* Table Section */}
      <div className="w-1/2 p-4  overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Invoice Data</h2>
        <InvoiceTable onRowClick={onRowClick} columns={columns} data={data} />
      </div>
      {/* Invoice Preview Section */}
      <div className="w-1/2 p-4 bg-white overflow-y-auto shadow-lg">
        <h2 className="text-lg font-bold mb-4">Invoice Preview</h2>
        <InvoicePreview data={selectedData} />
        <Button
          onClick={generatePDF}
          variant="solid"
          color="primary"
          className="mt-4"
          disabled={!selectedData}
        >
          Generate & Download Invoice
        </Button>
      </div>
      <CustomerDetails
        handleCloseModal={handleCloseModal}
        handleOpenModal={handleOpenModal}
        isOpen={isOpen ?? false}
        onOpen={onOpen}
        onClose={onClose}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        productData={productData}
      />
    </div>
  );
};

export default InvoiceComponent;
