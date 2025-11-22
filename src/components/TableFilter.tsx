"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type FilterOption = {
  label: string;
  value: string;
  param: string;
};

const TableFilter = ({ options }: { options: FilterOption[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const handleFilter = (param: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "") {
      params.delete(param);
    } else {
      params.set(param, value);
    }
    router.push(`${window.location.pathname}?${params}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    router.push(window.location.pathname);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image src="/filter.png" alt="" width={14} height={14} />
      </button>
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 p-4 border">
            <h3 className="font-semibold mb-3">Filters</h3>
            <div className="space-y-3">
              {options.map((option) => (
                <div key={option.param} className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">{option.label}</label>
                  <select
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
                    value={searchParams.get(option.param) || ""}
                    onChange={(e) => handleFilter(option.param, e.target.value)}
                  >
                    <option value="">All</option>
                    <option value={option.value}>{option.label}</option>
                  </select>
                </div>
              ))}
              <button
                onClick={clearFilters}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm hover:bg-gray-300"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TableFilter;
