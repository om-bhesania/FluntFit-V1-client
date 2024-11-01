import { Tab, Tabs } from "@nextui-org/react";
import { useState } from "react";
import { AddProducts } from "../../pages/products/addProduct";
import { DashAllCollection } from "../../pages/products/all-collections";

function DashHeader() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index: any) => {
    setActiveTab(index);
  };

  return (
    <div className="container flex flex-col items-center">
      <Tabs
        variant="bordered"
        onChange={handleTabChange}
        classNames={{
          base: "w-full",
          tabContent: "p-4 w-full",
          tabList: "w-full",
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
