import { useEffect, useState } from "react";

import { GetProductApi } from "../products/ProductsApi";
import useToast from "../../hooks/useToast";
import InvoiceComponent from './InvoiceComponent';
import { FormValues } from "../../../customerDetails/CustomerDetailsModal";

// Static customer list for demo
const customers = [
  { id: "1", name: "General Customer" },
  { id: "2", name: "John Doe" },
  { id: "3", name: "Jane Smith" },
];

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
  const [searchValue, setSearchValue] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const [items, setItems] = useState<any[]>([]); // Replace 'any' with actual type if needed
  const [taxRate, setTaxRate] = useState(5);
  const [discountRate, setDiscountRate] = useState(0);
  const [productsData, setProductsData] = useState<any[]>([]);
  const { notify } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  // Load products data from API
  const loadData = async () => {
    try {
      const result: any = await GetProductApi(notify);
      console.log("result", result);
      setProductsData(result?.products || []);
    } catch (error: any) {
      notify(error?.response.data.message, { type: "error" });
    }
  };

  // Handle customer search logic
  const handleCustomerSearch = (value: string) => {
    setSearchValue(value);
    const matchingCustomers = customers.filter((customer) =>
      customer.name.toLowerCase().includes(value.toLowerCase())
    );
    if (matchingCustomers.length === 0) {
      setFilteredCustomers([{ id: "new", name: "Create New Customer" }]);
    } else {
      setFilteredCustomers(matchingCustomers);
    }
  };

  // Add a new item to the invoice
  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      productName: "", // Initially no product selected
      quantity: 1,
      price: 0,
    };
    setItems([...items, newItem]);
  };

  // Remove an item from the invoice
  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Update an item's details
  const updateItem = (id: string, field: string, value: any) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, [field]: field === "productName" ? value : Number(value) }
          : item
      )
    );
  };

  // Handle product selection to auto-populate price
  const handleProductSelect = (itemId: string, productName: string) => {
    const selectedProduct = productsData.find(
      (product) => product.productName === productName
    );
    const price = selectedProduct ? selectedProduct.price : 0;
    updateItem(itemId, "productName", productName);
    updateItem(itemId, "price", price);
  };

  // Calculate the subtotal of items
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  // Calculate the discount on the subtotal
  const calculateDiscount = (subtotal: number) => {
    return (subtotal * discountRate) / 100;
  };

  // Calculate the tax on the subtotal after applying discount
  const calculateTax = (subtotal: number, discount: number) => {
    return ((subtotal - discount) * taxRate) / 100;
  };

  // Calculate the total after applying discount and adding tax
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    const tax = calculateTax(subtotal, discount);
    return subtotal - discount + tax;
  };

  return (
    <InvoiceComponent
      items={items}
      taxRate={taxRate}
      discountRate={discountRate}
      searchValue={searchValue}
      filteredCustomers={filteredCustomers}
      addItem={addItem}
      removeItem={removeItem}
      updateItem={updateItem}
      calculateSubtotal={calculateSubtotal}
      calculateDiscount={calculateDiscount}
      calculateTax={calculateTax}
      calculateTotal={calculateTotal}
      handleInput={handleCustomerSearch}
      setTaxRate={setTaxRate}
      setDiscountRate={setDiscountRate}
      productsData={productsData} 
    />
  );
}

export default InvoiceController;
