"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavSubItem {
  label: string;
  href: string;
  active?: boolean;
}

interface NavItem {
  icon: string;
  label: string;
  href: string;
  expanded?: boolean;
  active?: boolean;
  subItems?: NavSubItem[];
}

interface SideNavProps {
  isOpen: boolean;
}

const SideNav: React.FC<SideNavProps> = ({ isOpen }) => {
  const pathname = usePathname();
  const initialRenderRef = useRef(true);

  const [navItems, setNavItems] = useState<NavItem[]>([
    {
      icon: "inventory",
      label: "Stock",
      href: "/stock",
      expanded: false,
      active: false,
      subItems: [{ label: "View", href: "/stock/view", active: false }],
    },
    {
      icon: "orders",
      label: "Orders",
      href: "/orders",
      expanded: false,
      active: false,
      subItems: [
        { label: "Create Order", href: "/orders/create", active: false },
        { label: "Pending Orders", href: "/orders/pending", active: false },
        { label: "Delivered Orders", href: "/orders/delivered", active: false },
        { label: "Rejected Orders", href: "/orders/rejected", active: false },
      ],
    },
    {
      icon: "customers",
      label: "Customers",
      href: "/customers",
      expanded: false,
      subItems: [
        {
          label: "Outstandings",
          href: "/customers/viewOutstandings",
          active: false,
        },
      ],
    },
    // {
    //   icon: "reports",
    //   label: "Reports",
    //   href: "/reports",
    //   expanded: false,
    //   subItems: [
    //     {
    //       label: "Outstandings",
    //       href: "/reports/viewOutstandings",
    //       active: false,
    //     },
    //   ],
    // },
    {
      icon: "users",
      label: "Users",
      href: "/users",
      expanded: false,
      subItems: [
        {
          label: "Create User",
          href: "/users/create",
          active: false
        },
      ],
    },
    {
      icon: "notices",
      label: "Notices",
      href: "/notices",
      expanded: false,
      subItems: [
        {
          label: "Create Notices",
          href: "/notices/create",
          active: false
        },
      ],
    },
  ]);

  // Only update active states when pathname changes, not on every render
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
    }

    const updatedItems = navItems.map((item) => {
      // Check if current path matches this item's href or starts with it (for parent items)
      const isActive =
        pathname === item.href || pathname.startsWith(`${item.href}/`);

      // Check if any subItem matches the current path
      const hasActiveSubItem = item.subItems?.some(
        (subItem) =>
          pathname === subItem.href || pathname.startsWith(`${subItem.href}/`)
      );

      // Only expand if it has an active subitem and wasn't previously expanded
      const shouldExpand = hasActiveSubItem && !item.expanded;

      // Update sub-items active state
      const updatedSubItems = item.subItems?.map((subItem) => ({
        ...subItem,
        active:
          pathname === subItem.href || pathname.startsWith(`${subItem.href}/`),
      }));

      return {
        ...item,
        active: isActive,
        expanded: shouldExpand || (hasActiveSubItem && item.expanded),
        subItems: updatedSubItems,
      };
    });

    // Deep equality check to prevent unnecessary re-renders
    if (JSON.stringify(updatedItems) !== JSON.stringify(navItems)) {
      setNavItems(updatedItems);
    }
  }, [pathname]);

  // Toggle expanded state for an item
  const toggleExpand = (index: number) => {
    const updatedItems = [...navItems];
    updatedItems[index].expanded = !updatedItems[index].expanded;
    setNavItems(updatedItems);
  };

  // Dynamic class for mobile responsiveness
  const navClass = `bg-white h-screen w-64 overflow-y-auto transition-all duration-300 shadow-lg fixed lg:relative z-40
    ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`;

  return (
    <div className={navClass}>
      <div className="px-6 mt-4 text-gray-500">Dashboard</div>
      {/* Navigation Menu */}
      <nav className="mt-4">
        {navItems.map((item, index) => (
          <div key={index}>
            {item.subItems ? (
              // Items with subitems - click to expand
              <div
                className={`flex items-center px-6 py-3 cursor-pointer ${
                  item.active ? "text-blue-500 bg-blue-50" : "text-gray-600"
                } hover:bg-gray-100`}
                onClick={() => toggleExpand(index)}
              >
                <div className="w-6 mr-4">{getIcon(item.icon)}</div>
                <span>{item.label}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ml-auto transition-transform ${
                    item.expanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            ) : (
              // Items without subitems - direct link
              <Link
                href={item.href}
                className={`flex items-center px-6 py-3 cursor-pointer ${
                  item.active ? "text-blue-500 bg-blue-50" : "text-gray-600"
                } hover:bg-gray-100`}
              >
                <div className="w-6 mr-4">{getIcon(item.icon)}</div>
                <span>{item.label}</span>
              </Link>
            )}

            {/* Sub-items */}
            {item.subItems && item.expanded && (
              <div className="bg-gray-50">
                {item.subItems.map((subItem, subIndex) => (
                  <Link
                    href={subItem.href}
                    key={subIndex}
                    className={`flex items-center pl-16 py-2 ${
                      subItem.active
                        ? "text-blue-500 bg-blue-50"
                        : "text-gray-600"
                    } hover:bg-gray-100`}
                  >
                    <span>{subItem.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

// Helper function to return the appropriate icon
function getIcon(iconName: string) {
  switch (iconName) {
    case "dashboard":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      );
    case "inventory":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      );
    case "orders":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      );
    case "customers":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      );
    case "reports":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    case "users":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
  }
}

export default SideNav;
