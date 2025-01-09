 
interface AddProductComponentProps {
  categories: { value: string; label: string }[];
  sizeOptions: { value: string; label: string }[];
  subcategories: { value: string; label: string }[];
  GSTOptions: { value: string; label: string }[];
  InventoryOptions: { value: string; label: string }[];
  handleSKUGeneration: (
    setFieldValue: (field: string, value: any) => void
  ) => void;
  handleSubmit: (values: any) => void;
  isEdit?: boolean;
  prefilledData?: any;
  handleSaveEdit?: (updatedProduct: any, data: any) => void;
  getFiles: (files: any) => void;
  deleteAllProducts?: () => void;
  loading: boolean;
}

const AddProductComponent: React.FC<AddProductComponentProps> = ({
 
}) => {
 

  return (
    <div className="container">
       Cusotmer Form
    </div>
  );
};

export default AddProductComponent;
