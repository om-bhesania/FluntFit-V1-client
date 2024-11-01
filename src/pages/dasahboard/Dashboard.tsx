import React from "react";
import DashRouter from "./DashRouter";
import { Link, Route, Routes } from "react-router-dom";
import { DashHeader } from "../../components/header/DashHeader";
import { AddProducts } from "../products/addProduct";
import { DashAllCollection } from "../products/all-collections";

const Dashboard: React.FC = () => {
  return (
    <>
      <DashHeader />
    </>
  );
};

export default Dashboard;
