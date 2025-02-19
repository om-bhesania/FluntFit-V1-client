import { Button, Input } from "@nextui-org/react";
import type {
  ColumnDef,
  PaginationState,
  Table as ReactTable,
  Row,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import classNames from "classnames";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
  ChevronUpIcon,
  Download,
  Plus,
  Search,
} from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../loader/Loader";

interface ReactTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  renderSubComponent?: (props: { row: Row<T> }) => React.ReactElement;
  pageIndex?: number;
  pageSize?: number;
  pageCount?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  className?: string;
  loading: boolean;
  handleExport: () => void;
  isAddBtnVisible?: boolean;
  btnLink?: any;
  onRowClick?: any;
  buttonLabel?: string;
  noExport?: boolean;
}

function Table<T extends object>({
  data,
  columns,
  renderSubComponent,
  pageIndex,
  pageSize,
  onPaginationChange,
  className,
  loading,
  handleExport,
  isAddBtnVisible,
  btnLink,
  onRowClick,
  buttonLabel = "Add Product",
  noExport = false,
}: ReactTableProps<T>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: pageIndex || 0,
    pageSize: pageSize || 6, // Set to 6 rows per page
  });
  const [sorting, setSorting] = useState([{ id: "date", desc: true }]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data.filter((item) => {
    return Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });
  // Slice the filteredData to display the correct page
  const displayedData = filteredData.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(displayedData.length / pagination.pageSize), // Use displayedData here
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  });

  useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange(pagination);
    }
  }, [pagination, onPaginationChange]);

  const nav = useNavigate();
  const handleRediect = () => {
    nav(btnLink);
  };

  return (
    <div className="flex flex-col my-5 overflow-x-auto">
      <div className="mb">
        <div className="flex items-center justify-between mb-4 w-full">
          <Input
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-[400px] flex-1 !text-gray-300"
            placeholder="Search..."
            variant="bordered"
            startContent={<Search className="text-gray-400 " />}
          />
          <div className="space-x-2 flex-1 flex items-center justify-end">
            {isAddBtnVisible && (
              <Button
                onClick={handleRediect}
                variant="flat"
                color="secondary"
                className="text-white max-md:text-xs max-md:px-1 max-md:mx-1"
              >
                <Plus className="max-md:h-5 max-md:w-5" />{" "}
                <span className="max-md:hidden">{buttonLabel}</span>
              </Button>
            )}
            {noExport ? null : (
              <Button
                onClick={handleExport}
                variant="bordered"
                color="secondary"
                className="max-md:text-xs max-md:px-1 max-md:mx-1"
              >
                <Download className="max-md:h-5 max-md:w-5" />{" "}
                <span className="max-md:hidden">Export as Csv</span>
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto shadow-xl rounded-2xl tablee ">
        <div className="inline-block min-w-full">
          <div className="overflow-hidden rounded-2xl">
            <table
              className={classNames("min-w-full whitespace-nowrap", className)}
            >
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className=" bg-gray-940">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="py-3.5 px-3 text-left text-gray-300 font-semibold text-base cursor-pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center justify-center">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getIsSorted() === "asc" && (
                              <ChevronUpIcon className="h-4 w-4 ml-1" />
                            )}
                            {header.column.getIsSorted() === "desc" && (
                              <ChevronDownIcon className="h-4 w-4 ml-1" />
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="py-2.5 px-3 text-center"
                    >
                      <Loader size="lg" />
                    </td>
                  </tr>
                ) : displayedData.length > 0 ? (
                  <>
                    {table.getRowModel().rows.map((row) => (
                      <Fragment key={row.id}>
                        <tr
                          className={classNames(
                            "hover:bg-gray-800/30 border-b-1 border-gray-500/20 max-h-[500px] odd:bg-gray-940/20"
                          )}
                          onClick={() => onRowClick && onRowClick(row.original)}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="py-2 px-3 whitespace-nowrap text-center text-gray-300 text-sm"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>

                        {renderSubComponent ? (
                          <tr key={row.id + "-expanded"}>
                            <td colSpan={columns.length}>
                              {renderSubComponent({ row })}
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="py-3.5 px-3 text-center text-gray-300"
                    >
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {filteredData.length > pagination.pageSize && (
        <Pagination table={table} data={filteredData} />
      )}
    </div>
  );
}

function Pagination<T>({
  table,
  data,
}: React.PropsWithChildren<{ table: ReactTable<T>; data: any }>) {
  return (
    <>
      {data.length > 0 && (
        <div className="flex items-center justify-between p-2 self-end mt-3">
          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              variant="ghost"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>
            <Button
              isIconOnly
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              variant="ghost"
            >
              <ChevronsLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm !text-gray-300">
              <span>Page </span>
              <strong className="">
                <span className="text-primary">
                  {table.getState().pagination.pageIndex + 1}
                </span>{" "}
                of {table.getPageCount()}
              </strong>
            </span>
            <Button
              isIconOnly
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              variant="ghost"
            >
              <ChevronsRight className="h-5 w-5" />
            </Button>
            <Button
              isIconOnly
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              variant="ghost"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default Table;
