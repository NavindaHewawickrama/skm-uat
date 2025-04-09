"use client";
import React, { useState, useMemo } from "react";
import AppBar from "@/components/Appbar";
import SideNav from "@/components/Sidenav";
import Footer from "@/components/Footer";
import ViewOrderEditPopupButton from "@/components/ViewOrderEditPopupButton";
import ViewStatusPopup from "@/components/ViewStatusPopup";

const PendingOrdersPage: React.FC = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("50");
  const [currentPage, setCurrentPage] = useState(1);
  const [listViewOpen, setListViewOpen] = useState(false);
  const [selectedOrder,setSelectedOrder] = useState([]);
  const [status,setStatus] = useState("");
  const [statusViewOpen,setStatusViewOpen] = useState(false);

  //#region
  // Sample pending orders data
  const pendingOrders = [
    {
      orderNo: "73511036",
      customer: "INTERLANKA AUTO SPARES COMPANY",
      salesRef: "manjula",
      orderDate: "4/5/2025, 4:39:15 PM",
      type: "credit",
      total: 91672.5,
      itemDetails: [{itemName:"Gel Pump",unitPrice:"500",quantity:"500",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "",
      status: "Pending",
    },
    {
      orderNo: "73512892",
      customer: "INTERLANKA AUTO SPARES COMPANY",
      salesRef: "manjula",
      orderDate: "4/5/2025, 4:43:53 PM",
      type: "credit",
      total: 72547.5,
      itemDetails: [{itemName:"Light",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Tires",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "",
      status: "Pending",
    },
    {
      orderNo: "73518921",
      customer: "MAHA AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/6/2025, 10:12:30 AM",
      type: "credit",
      total: 56832.75,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Urgent delivery",
      status: "Processing",
    },
    {
      orderNo: "73523456",
      customer: "ROYAL MOTORS SUPPLIES",
      salesRef: "danushka",
      orderDate: "4/7/2025, 9:45:22 AM",
      type: "credit",
      total: 43250.0,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Processing",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Processing",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Processing",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Processing",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Processing",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: [{itemName:"Oil Pump",unitPrice:"500",quantity:"8",discount:"12",total:"250.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Tires",unitPrice:"100",quantity:"5",discount:"12",total:"2500.00"},{itemName:"Oil Pump",unitPrice:"500",quantity:"5",discount:"12",total:"2500.00"}],
      note: "Confirm availability",
      status: "Pending",
    },
  ];

  //#endregion

  // Filter orders based on search query
  const filteredOrders = useMemo(() => {
    return pendingOrders.filter(
      (order) =>
        order.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.salesRef.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [pendingOrders, searchQuery]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredOrders.length / parseInt(entriesPerPage));
  }, [filteredOrders.length, entriesPerPage]);

  const currentOrders = useMemo(() => {
    const itemsPerPage = parseInt(entriesPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage, entriesPerPage]);

  // Generate page numbers for pagination - copied from StockView
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // If we have fewer pages than max, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);

      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're at edges
      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      // Add ellipsis if needed before middle pages
      if (start > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed after middle pages
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always include last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  const handleItemDetailsView = (order:any) => {
    console.log(order);
    setSelectedOrder(order);
    setListViewOpen(true)
  }
  // Handle entries per page change
  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(e.target.value);
    setCurrentPage(1); // Reset to first page when changing entries per page
  };

  function handleStatus(status: string): void {
    setStatus(status);
    setStatusViewOpen(true);
  }

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* App Bar */}
      <AppBar toggleSideNav={toggleSideNav} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Side Navigation */}
        <SideNav isOpen={sideNavOpen} />

        {/* Order Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-4 overflow-auto">
            {/* Pending Orders Card */}
            <div className="bg-white p-6 rounded-md shadow-sm mb-4">
              <h2 className="text-lg font-bold mb-4">Pending Orders</h2>

              {/* Table controls */}
              <div className="flex flex-col md:flex-row justify-between mb-4 space-y-2 md:space-y-0">
                <div className="flex items-center">
                  <span className="mr-2">Show</span>
                  <select
                    value={entriesPerPage}
                    onChange={handleEntriesChange}
                    className="border rounded px-2 py-1"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="ml-2">entries</span>
                </div>

                <div className="flex items-center">
                  <span className="mr-2">Search:</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type Here..."
                    className="border rounded px-2 py-1 w-full md:w-auto focus:outline-none focus:ring-1"
                  />
                </div>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Order No
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Sales Ref
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Order Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Item Details
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Note
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentOrders.map((order, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 border text-sm">
                          {order.orderNo}
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          {order.customer}
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          {order.salesRef}
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          {order.orderDate}
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          {order.type}
                        </td>
                        <td className="px-4 py-3 border text-sm text-right">
                          {order.total.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 border text-sm text-center">
                          <button className="bg-indigo-600 text-white py-1 px-4 rounded hover:bg-indigo-700 focus:outline-none cursor-pointer" onClick={()=>handleItemDetailsView(order)}>
                            View
                          </button>
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          {order.note}
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 border text-sm text-center">
                          <button className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded focus:outline-none cursor-pointer" onClick={()=>handleStatus(order.status)} >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white p-4 mt-4 flex flex-wrap justify-between items-center">
                <div className="text-sm">
                  Showing{" "}
                  {filteredOrders.length > 0
                    ? (currentPage - 1) * parseInt(entriesPerPage) + 1
                    : 0}{" "}
                  to{" "}
                  {Math.min(
                    currentPage * parseInt(entriesPerPage),
                    filteredOrders.length
                  )}{" "}
                  of {filteredOrders.length} entries
                </div>
                <div className="flex items-center space-x-1 mt-2 sm:mt-0">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 border rounded cursor-pointer ${currentPage === 1 ? "text-gray-400" : "hover:bg-gray-100"
                      }`}
                  >
                    Previous
                  </button>

                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === "number" && goToPage(page)}
                      className={`px-3 py-1 border rounded ${page === currentPage
                        ? "bg-blue-500 text-white"
                        : page === "..."
                          ? ""
                          : "hover:bg-gray-100"
                        }`}
                      disabled={page === "..."}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`px-3 py-1 border rounded cursor-pointer ${currentPage === totalPages || totalPages === 0
                      ? "text-gray-400"
                      : "hover:bg-gray-100"
                      }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

          </div>
          <ViewOrderEditPopupButton open={listViewOpen} onClose={() => setListViewOpen(false)} orderDetails={selectedOrder}/>
            <ViewStatusPopup open={statusViewOpen} onClose={()=> setStatusViewOpen(false)} status={status}/>
          {/* Footer Component */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default PendingOrdersPage;
