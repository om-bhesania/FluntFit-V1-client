import { Button, Spinner, Input } from "@nextui-org/react";
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
  btnLink?: string;
}

function Table<T extends object>({
  data,
  columns,
  renderSubComponent,
  pageIndex,
  pageSize,
  pageCount,
  onPaginationChange,
  className,
  loading,
  handleExport,
  isAddBtnVisible,
  btnLink,
}: ReactTableProps<T>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: pageIndex ?? 0,
    pageSize: pageSize ?? 6,
  });
  const [sorting, setSorting] = useState([{ id: "date", desc: true }]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount,
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

  return (
    <div className="flex flex-col my-5 overflow-x-auto">
      <div className="mb-4 flex items-center justify-between">
        <Input
          aria-label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md"
          placeholder="Search..."
          variant="bordered"
          startContent={<Search className="text-gray-400" />}
        />
        <div className="space-x-2">
          {isAddBtnVisible && (
            <Button
              onClick={() => nav(btnLink || "")}
              variant="flat"
              color="secondary"
              className="flex items-center gap-2"
            >
              <Plus /> Add Product
            </Button>
          )}
          <Button
            onClick={handleExport}
            variant="bordered"
            color="primary"
            className="flex items-center gap-2"
          >
            <Download /> Export as CSV
          </Button>
        </div>
      </div>

      <div className="overflow-hidden shadow-md rounded-lg">
        <table
          className={classNames(
            "min-w-full divide-y divide-gray-200 bg-white",
            className
          )}
        >
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center">
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
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-3 text-center">
                  <Spinner size="lg" />
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <tr className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 text-sm text-gray-700 text-center"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                  {renderSubComponent && (
                    <tr>
                      <td colSpan={columns.length}>
                        {renderSubComponent({ row })}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-3 text-center">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredData.length > pagination.pageSize && (
        <Pagination table={table} />
      )}
    </div>
  );
}

function Pagination<T>({
  table,
}: React.PropsWithChildren<{ table: ReactTable<T> }>) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-2">
        <Button
          isIconOnly
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          variant="ghost"
        >
          <ChevronsLeft className="h-5 w-5" />
        </Button>
        <Button
          isIconOnly
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          variant="ghost"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>
        <span className="text-sm">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          isIconOnly
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          variant="ghost"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </Button>
        <Button
          isIconOnly
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          variant="ghost"
        >
          <ChevronsRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

export default Table;
