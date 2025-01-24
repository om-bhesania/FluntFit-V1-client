import { useEffect, useState } from "react";
import * as Yup from "yup";
import useToast from "../../hooks/useToast";
import { AddCustomersApi, GetCustomerApi } from "../customers/CustomerApis";
import { GetProductApi } from "../products/ProductsApi";
import { FormValues } from "./customerDetails/CustomerDetailsModal";
import InvoiceComponent from "./InvoiceComponent";

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
  const [items, setItems] = useState<any[]>([
    {
      id: Date.now().toString(), // Unique ID for the first item
      productName: "",
      productId: "",
      quantity: 1,
      price: 0,
      total: 0,
    },
  ]); // Replace 'any' with actual type if needed
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any>([]);
  const [newCustomerData, setNewCustomerData] = useState<any>([]);
  const [isNewCustomer, setIsNewCustomer] = useState<any>([]);
  const [searchValue, setSearchValue] = useState("");
  const [taxRate, setTaxRate] = useState(5);
  const [discountRate, setDiscountRate] = useState("");
  const [cashDiscountRate, setCashDiscountRate] = useState(0);
  const [productsData, setProductsData] = useState<any[]>([]);
  const [selectedProductsData, setSelectedProductsData] = useState<any>([]);
  // State to track product GST rates for each row
  const [productGSTRates, setProductGSTRates] = useState<{
    [key: string]: number;
  }>({});
  const { notify } = useToast();

  const handleSelectedProductDataForInvoice = (
    selectedId?: string,
    otherData?: any
  ) => {
    const filteredProductData = productsData.find(
      (item: any) => item._id === selectedId
    );
    console.log("otherData", otherData);
    setSelectedProductsData((prev: any) => {
      return [...prev, filteredProductData];
    });
  };
  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    number: Yup.string()
      .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
      .required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    email: Yup.string().email("Invalid email address"),
    state: Yup.string().required("State is Required"),
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
    console.log("Search Value:", value);
    setSearchValue(value);

    if (value.trim() === "") {
      setFilteredCustomers(customers); // Reset the list when search is empty
    } else {
      // Filter customers by name or phone
      const matchingCustomers = customers.filter(
        (customer: any) =>
          customer.name.toLowerCase().includes(value.toLowerCase()) ||
          customer.phone.includes(value)
      );

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
  // const addItem = () => {
  //   const newItem = {
  //     id: Date.now().toString(), // Unique ID for this item
  //     productName: "", // Initially empty
  //     quantity: 1,
  //     price: 0,
  //     total: 0,
  //   };

  //   setItems((prevItems) => [...prevItems, newItem]);
  // };

  const handleProductSelect = (itemId: string, selectedProductId: string) => {
    const selectedProduct = productsData.find(
      (product: any) => product._id === selectedProductId
    );

    if (!selectedProduct) {
      console.error("Selected product not found!");
      return;
    }

    // Update the item in the `items` array
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              productName: selectedProduct.name || "",
              price: selectedProduct.price || 0,
              total: selectedProduct.price || 0,
            }
          : item
      )
    );

    // Optionally update GST rates
    const gstRate = selectedProduct.gst || 0;
    setProductGSTRates((prev) => ({
      ...prev,
      [itemId]: gstRate,
    }));
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

  // Remove an item from the invoice
  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Calculate the total for each individual item
  const calculateItemTotal = (quantity: number, price: number) => {
    return quantity * price;
  };

  // Calculate the subtotal of items
  const calculateSubtotal = () =>
    items.reduce((acc, item) => acc + item.total, 0);

  // Calculate the discount on the subtotal
  const calculateDiscount = (subtotal: number) => {
    return (subtotal * Number(discountRate)) / 100;
  };

  // Calculate the cash discount (flat amount)
  const calculateCashDiscount = (subtotal: number) => {
    // Ensure the cash discount does not exceed the subtotal
    return cashDiscountRate > subtotal ? subtotal : cashDiscountRate;
  };

  // Calculate the CGST
  const calculateCGST = (subtotal: number, discount: number) => {
    return ((subtotal - discount) * (taxRate / 2)) / 100;
  };

  // Calculate the SGST
  const calculateSGST = (subtotal: number, discount: number) => {
    return ((subtotal - discount) * (taxRate / 2)) / 100;
  };
  // Calculate the tax on the subtotal after applying discount
  const calculateTax = (subtotal: number, discount: number) => {
    return ((subtotal - discount) * taxRate) / 100;
  };

  // Calculate the total after applying discounts and adding tax
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const percentageDiscount = calculateDiscount(subtotal);
    const cashDiscount = calculateCashDiscount(subtotal);
    const totalDiscount = percentageDiscount + cashDiscount; // Combine both discounts
    const tax = calculateTax(subtotal, totalDiscount);
    return subtotal - totalDiscount + tax;
  };

  const [isModalOpen, setModalOpen] = useState(false);

  // Initial form values
  const initialValues: FormValues = {
    name: "",
    phone: "",
    address: "",
    email: "",
    state: "",
    city: "",
    dob: null,
  };

  // Handle form submission
  const handleSubmit = async (values: FormValues) => {
    const res = await AddCustomersApi(values, notify);
    setFilteredCustomers(res.response.newCustomer);
    setNewCustomerData(res.response.newCustomer);
    setIsNewCustomer(res.response.status === "Success" ? true : false);
    setModalOpen(false); // Close the modal
  };

  // Open modal
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setFilteredCustomers(customers);
  };

  return (
    <InvoiceComponent
      items={items}
      taxRate={taxRate}
      discountRate={Number(discountRate)}
      cashDiscountRate={cashDiscountRate}
      searchValue={searchValue}
      filteredCustomers={filteredCustomers}
      // addItem={addItem}
      removeItem={removeItem}
      updateItem={updateItem}
      calculateSubtotal={calculateSubtotal}
      calculateDiscount={calculateDiscount}
      calculateCashDiscount={calculateCashDiscount}
      calculateTax={calculateTax}
      calculateCGST={calculateCGST}
      calculateSGST={calculateSGST}
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
      validationSchema={validationSchema}
      handleOpenModal={handleOpenModal}
      handleCustomerSearch={handleCustomerSearch}
      newCustomerData={newCustomerData}
      isNewCustomer={isNewCustomer}
      setCashDiscountRate={setCashDiscountRate}
      setItems={setItems}
      productGSTRates={productGSTRates}
      setProductGSTRates={setProductGSTRates}
      handleProductSelect={handleProductSelect}
      setNewCustomerData={setNewCustomerData}
      customers={customers}
      handleSelectedProductDataForInvoice={handleSelectedProductDataForInvoice}
      selectedProductsData={selectedProductsData}
    />
  );
}

export default InvoiceController;
