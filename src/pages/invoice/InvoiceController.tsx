import { useEffect, useState } from "react";
import * as Yup from "yup";
import useToast from "../../hooks/useToast";
import { AddCustomersApi, GetCustomerApi } from "../customers/CustomerApis";
import { GetProductApi } from "../products/ProductsApi";
import { FormValues } from "./customerDetails/CustomerDetailsModal";
import { AddInvoiceApi } from "./InvoiceApis";
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
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any>([]);
  const [newCustomerData, setNewCustomerData] = useState<any>([]);
  const [isNewCustomer, setIsNewCustomer] = useState<any>([]);
  const [searchValue, setSearchValue] = useState("");

  const [discountRate, setDiscountRate] = useState("");
  const [cashDiscountRate, setCashDiscountRate] = useState(0);
  const [productsData, setProductsData] = useState<any[]>([]);

  // State to track product GST rates for each row
  const [productGSTRates, setProductGSTRates] = useState<{
    [key: string]: number;
  }>({});
  const { notify } = useToast();

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
      // const invoiceHistoryData = await GetInvoiceApi(notify);
      setProductsData(result.products || []);
      setCustomers(response);
      setFilteredCustomers(response);
      // setInvoiceHistory(invoiceHistoryData);
    } catch (error: any) {
      notify(error?.response.data.message, { type: "error" });
    }
  };

  const saveInvoice = async (data: any) => {
    try {
      await AddInvoiceApi(data, notify);
    } catch {
      return true;
    }
  };

  const handleCustomerSearch = (value: string) => {
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
      handleCloseModal();
    } catch (error) {
      return false;
    }
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
    customer: [],
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
      filteredCustomers={filteredCustomers}
      handleCustomerSearch={handleCustomerSearch}
      newCustomerData={newCustomerData}
      isNewCustomer={isNewCustomer}
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      onSubmit={handleSubmit}
      searchValue={searchValue}
      initialValues={initialValues}
      cashDiscountRate={cashDiscountRate}
      productsData={productsData}
      handleOpenModal={handleOpenModal}
      handleCloseModal={handleCloseModal}
      setNewCustomerData={setNewCustomerData}
      handleCreateNewCustomer={handleCreateNewCustomer}
      // =========================================
      discountRate={Number(discountRate)}
      handleInput={handleCustomerSearch}
      setDiscountRate={setDiscountRate}
      validationSchema={validationSchema}
      setCashDiscountRate={setCashDiscountRate}
      productGSTRates={productGSTRates}
      setProductGSTRates={setProductGSTRates}
      customers={customers}
      handleSubmit={handleSubmit}
      saveInvoice={saveInvoice}
    />
  );
}

export default InvoiceController;
