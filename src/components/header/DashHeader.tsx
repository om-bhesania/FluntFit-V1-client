import { Tab, Tabs } from "@nextui-org/react";
import { AddProducts } from "../../pages/products/addProduct";
import { DashAllCollection } from "../../pages/products/all-collections";

function DashHeader() {
  return (
    <div className="container flex flex-col items-center">
      <Tabs
        variant="bordered"
        classNames={{
          base: "w-full",
          tabContent: "p-4 w-full",
          tabList: "w-full overflow-visible",
          panel: "w-full",
        }}
      >
        <Tab key="add-products" title="Add Products" className="!w-full">
          <AddProducts />
        </Tab>
        <Tab key="all-collections" title="All Collections">
          <DashAllCollection />
        </Tab>
      </Tabs>
    </div>
  );
}

export { DashHeader };

