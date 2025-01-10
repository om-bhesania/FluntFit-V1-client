import { useEffect, useState } from "react";

import { GetProductApi } from "../products/ProductsApi";
import useToast from "../../hooks/useToast";
import InvoiceComponent from "./InvoiceComponent";
import { FormValues } from "../../../customerDetails/CustomerDetailsModal";
import { AddCustomersApi, GetCustomerApi } from "../customers/CustomerApis";
import * as Yup from "yup";
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
  const [items, setItems] = useState<any[]>([]); // Replace 'any' with actual type if needed
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any>([]);
  const [customersData, setCustomersData] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [taxRate, setTaxRate] = useState(5);
  const [discountRate, setDiscountRate] = useState(0);
  const [productsData, setProductsData] = useState<any[]>([]);
  const { notify } = useToast();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    number: Yup.string()
      .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
      .required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    email: Yup.string().email("Invalid email address"),
  });
  useEffect(() => {
    loadData();
  }, []);

  // Load products data from API
  const loadData = async () => {
    try {
      const result: any = await GetProductApi(notify);
      const response = await GetCustomerApi(notify);
      setProductsData(result?.products || []);
      setCustomers(response);
      setFilteredCustomers(response);
    } catch (error: any) {
      notify(error?.response.data.message, { type: "error" });
    }
  };

  const handleCustomerSearch = (value: string) => {
    setSearchValue(value);
    // Check if the search value is empty
    if (value.trim() === "") {
      // Reset to show all customers if the search input is cleared
      setFilteredCustomers(customers);
    } else {
      // Filter customers based on the search value
      const matchingCustomers = customers.filter((customer: any) =>
        customer.name.toLowerCase().includes(value.toLowerCase())
      );

      // Show "Create New Customer" if no matching customers are found
      if (matchingCustomers.length === 0) {
        setFilteredCustomers([{ _id: "new", name: "Create New Customer" }]);
      } else {
        setFilteredCustomers(matchingCustomers);
      }
    }
  };

  // Handle "Create New Customer" click
  const handleCreateNewCustomer = async () => {
    try {
      await GetCustomerApi(notify);
      loadData();
      notify("Customer created successfully", { type: "success" });
    } catch (error) {
      notify("Failed to create new customer", { type: "error" });
      console.error(error);
    }
  };

  // Add a new item to the invoice
  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      productName: "", // Initially no product selected
      quantity: 1,
      price: 0,
      total: "",
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
          ? {
              ...item,
              [field]: field === "productName" ? value : Number(value),
            }
          : item
      )
    );
  };
  // Calculate the total for each individual item
  const calculateItemTotal = (quantity: number, price: number) => {
    return quantity * price;
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

  const [isModalOpen, setModalOpen] = useState(false);

  // Initial form values
  const initialValues: FormValues = {
    name: "",
    phone: "",
    address: "",
    email: "",
  };

  // Handle form submission
  const handleSubmit = async (values: FormValues) => {
    const res = await AddCustomersApi(values, notify);
    console.log(res);
    // setCustomersData(res);
    setModalOpen(false); // Close the modal
  };

  // Open modal
  const handleOpenModal = () => {
    console.log('first')
    setModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
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
      calculateItemTotal={calculateItemTotal}
      handleCreateNewCustomer={handleCreateNewCustomer}
      initialValues={initialValues}
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      onSubmit={handleSubmit}
      customersData={customersData}
      validationSchema={validationSchema}
      handleOpenModal={handleOpenModal}
      handleCustomerSearch={handleCustomerSearch}
    />
  );
}

export default InvoiceController;
