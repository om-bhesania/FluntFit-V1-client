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
  Search,
} from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";

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
}: ReactTableProps<T>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: pageIndex ?? 0,
    pageSize: pageSize ?? 6, // Start pagination after 6 records
  });
  const [sorting, setSorting] = useState([{ id: "date", desc: true }]); // default sorting by "date" column in descending order
  const [searchQuery, setSearchQuery] = useState(""); // Store global search query

  // Filter data based on the search query
  const filteredData = data.filter((item) => {
    return Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

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

  return (
    <div className="flex flex-col my-5 overflow-x-auto">
      <div className="mb">
        <div className="flex items-center justify-between mb-4 w-full">
          <Input
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-[400px]"
            placeholder="Search..."
            startContent={<Search className="text-gray-400" />}
          />
          <Button onClick={handleExport} variant="bordered" color="primary">
            <Download /> Export as Csv
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto shadow-xl rounded-lg tablee">
        <div className="inline-block min-w-full py-1">
          <div className="overflow-hidden p-1 rounded-2xl">
            <table
              className={classNames("min-w-full whitespace-nowrap", className)}
            >
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b bg-gray-100">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="py-3.5 px-3 text-left text-gray-600 cursor-pointer"
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
                      className="py-3.5 px-3 text-center"
                    >
                      <Spinner size="lg" className="h-12 w-12 text-center" />
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  <>
                    {table.getRowModel().rows.map((row) => (
                      <Fragment key={row.id}>
                        <tr
                          className={classNames(
                            "hover:bg-gray-50 border-b-1 border-gray-500/20"
                          )}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="py-3.5 px-3 whitespace-nowrap text-center"
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
                      className="py-3.5 px-3 text-center"
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
      {filteredData.length > 6 && (
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
      {!data.length  && (
        <div className="flex items-center justify-between p-2 self-end mt-3">
          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-2 border-primary border-2"
              variant="ghost"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>
            <Button
              isIconOnly
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 border-primary border-2"
              variant="ghost"
            >
              <ChevronsLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm">
              <span>Page </span>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
            <Button
              isIconOnly
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 border-primary border-2"
              variant="ghost"
            >
              <ChevronsRight className="h-5 w-5" />
            </Button>
            <Button
              isIconOnly
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-2 border-primary border-2"
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
