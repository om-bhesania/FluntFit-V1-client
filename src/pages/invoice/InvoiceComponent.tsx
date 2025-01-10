import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { EqualIcon, Plus, Trash2, X } from "lucide-react";
import React, { useState } from "react";
import { CustomerDetails } from "./customerDetails";
import CustomerDetailsModal from "../../../customerDetails/CustomerDetailsModal";

interface InvoiceComponentType {
  items: any[];
  taxRate: number;
  discountRate: number;
  searchValue: string;
  filteredCustomers: any[];
  addItem: () => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, field: string, value: any) => void;
  calculateSubtotal: () => number;
  calculateDiscount: (subtotal: number) => number;
  calculateTax: (subtotal: number, discount: number) => number;
  calculateTotal: () => number;
  handleInput: (value: string) => void;
  setTaxRate: React.Dispatch<React.SetStateAction<number>>;
  setDiscountRate: React.Dispatch<React.SetStateAction<number>>;
  productsData: any;
  calculateItemTotal: (quantity: any, price: any) => any;
  handleCreateNewCustomer: () => void;
  initialValues: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  customersData: any;
  validationSchema: any;
  handleOpenModal: () => void;
  handleCustomerSearch: (data: any) => void;
}

const InvoiceComponent: React.FC<InvoiceComponentType> = ({
  items,
  taxRate,
  discountRate,
  filteredCustomers,
  addItem,
  removeItem,
  updateItem,
  calculateSubtotal,
  calculateDiscount,
  calculateTax,
  calculateTotal,
  handleCustomerSearch,
  setTaxRate,
  setDiscountRate,
  productsData,
  calculateItemTotal,
  initialValues,
  isOpen,
  onClose,
  onSubmit,
  handleOpenModal,
}) => {
  return (
    <>
      <div className="container">
        <div className="flex justify-between mb-8 gap-4 flex-wrap max-w-1/2">
          <div className="flex-1 w-full">
            <h2 className="text-sm font-medium mb-2">Current Date:</h2>
            <Input
              variant="bordered"
              color="default"
              type="text"
              value={new Date().toLocaleDateString()}
              isReadOnly
              className="w-full"
            />
          </div>
          <div className="flex-1 w-full">
            <h2 className="text-sm font-medium mb-2">Invoice Number:</h2>
            <Input
              variant="bordered"
              color="default"
              type="text"
              defaultValue="1"
              className="w-full"
            />
          </div>
          <div className="flex-1 w-full">
            <h2 className="text-sm font-medium mb-2">Cashier:</h2>
            <Input
              variant="bordered"
              color="default"
              type="text"
              defaultValue="Administrator"
              className="w-full"
            />
          </div>
          <div className="flex-1 w-full">
            <h2 className="text-sm font-medium mb-2">Customer:</h2>
            <Autocomplete
              items={filteredCustomers}
              onInput={(e) =>
                handleCustomerSearch((e.target as HTMLInputElement).value)
              }
              className="max-w-[400px]"
              placeholder="Search or create a new customer"
              variant="bordered"
              color="default"
            >
              {(item) => (
                <AutocompleteItem key={item._id} className="capitalize">
                  {item._id === "new" ? (
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={handleOpenModal}
                    >
                      <Plus className="!h-4 !w-4 text-primary" />
                      {item.name}
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <small className="text-gray-500">{item.phone}</small>
                    </div>
                  )}
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex-1">
            <Table
              aria-label="Invoice items table"
              classNames={{
                td: "p-0 py-2 pe-2",
              }}
            >
              <TableHeader>
                <TableColumn className="!w-[400px] flex-shrink-0">
                  ITEM
                </TableColumn>
                <TableColumn>QTY</TableColumn>
                <TableColumn>PRICE</TableColumn>
                <TableColumn>TOTAL</TableColumn>
                <TableColumn>ACTION</TableColumn>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    {/* name */}
                    <TableCell className="w-[400px]">
                      <Select
                        variant="bordered"
                        placeholder="Select a product"
                        value={item.name}
                        onChange={(e) => {
                          const selectedProductId = e.target.value;
                          console.log("selectedProductId", selectedProductId);
                          const selectedProduct = productsData.filter(
                            (product: any) => product._id === selectedProductId
                          );
                          if (selectedProduct) {
                            updateItem(
                              item.id,
                              "name",
                              selectedProduct.productName
                            );
                            updateItem(
                              item.id,
                              "price",
                              selectedProduct?.[0].salePrice
                                ? selectedProduct?.[0].salePrice
                                : selectedProduct?.[0].price
                            );
                          }
                        }}
                        aria-label="Select product"
                      >
                        {productsData.map((product: any) => (
                          <SelectItem
                            className="max-w-[400px] "
                            key={product._id}
                            value={product.productName}
                          >
                            {product.productName}
                          </SelectItem>
                        ))}
                      </Select>
                    </TableCell>
                    {/* quantity */}
                    <TableCell className="">
                      <Input
                        variant="bordered"
                        color="default"
                        type="number"
                        value={item.quantity.toString()}
                        onChange={(e) =>
                          updateItem(item.id, "quantity", e.target.value)
                        }
                        className="w-full"
                      />
                    </TableCell>
                    {/* price */}
                    <TableCell className="">
                      <Input
                        variant="bordered"
                        color="default"
                        type="number"
                        value={item.price.toString()} // Make sure item.price is a number
                        onChange={(e) =>
                          updateItem(item.id, "price", e.target.value)
                        }
                        className="w-full"
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">
                              ₹
                            </span>
                          </div>
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="w-full flex items-center justify-center">
                        ₹{calculateItemTotal(item.quantity, item.price)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        isIconOnly
                        color="danger"
                        variant="light"
                        onClick={() => removeItem(item.id)}
                        className="w-full flex items-center justify-center"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Button
              color="default"
              variant="flat"
              className="mt-4"
              onClick={addItem}
            >
              <Plus className="text-primary !h-5 !w-5" /> Add Item
            </Button>

            <div className="mt-8 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Discount ({discountRate}%):</span>
                <span>
                  ₹{calculateDiscount(calculateSubtotal()).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">GST ({taxRate}%):</span>
                <span>
                  ₹
                  {calculateTax(
                    calculateSubtotal(),
                    calculateDiscount(calculateSubtotal())
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="w-[300px] space-y-4">
            <div>
              <h2 className="text-sm font-medium mb-2">GST:</h2>
              <Input
                variant="bordered"
                color="default"
                type="number"
                value={taxRate.toString()}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                endContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">%</span>
                  </div>
                }
              />
            </div>
            <div>
              <h2 className="text-sm font-medium mb-2">Discount rate:</h2>
              <Input
                variant="bordered"
                color="default"
                type="number"
                value={discountRate.toString()}
                onChange={(e) => setDiscountRate(Number(e.target.value))}
                endContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">%</span>
                  </div>
                }
              />
            </div>
            <Button color="primary" className="w-full">
              Review Invoice
            </Button>
          </div>
        </div>
      </div>
      <CustomerDetailsModal
        initialValues={initialValues}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default InvoiceComponent;
