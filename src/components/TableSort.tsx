"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type SortOption = {
  label: string;
  value: string;
};

const TableSort = ({ options }: { options: SortOption[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams);
    const currentSort = params.get("sort");
    const currentOrder = params.get("order");

    if (currentSort === value) {
      // Toggle order if same field
      if (currentOrder === "asc") {
        params.set("order", "desc");
      } else if (currentOrder === "desc") {
        params.delete("sort");
        params.delete("order");
      } else {
        params.set("order", "asc");
      }
    } else {
      params.set("sort", value);
      params.set("order", "asc");
    }

    router.push(`${window.location.pathname}?${params}`);
    setIsOpen(false);
  };

  const currentSort = searchParams.get("sort");
  const currentOrder = searchParams.get("order");

  return (
    <div className="relative">
      <button
        className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image src="/sort.png" alt="" width={14} height={14} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 p-2 border">
            <h3 className="font-semibold mb-2 px-2">Sort By</h3>
            <div className="space-y-1">
              {options.map((option) => {
                const isActive = currentSort === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSort(option.value)}
                    className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 flex justify-between items-center ${
                      isActive ? "bg-lamaSkyLight" : ""
                    }`}
                  >
                    <span>{option.label}</span>
                    {isActive && (
                      <span className="text-xs">
                        {currentOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TableSort;
